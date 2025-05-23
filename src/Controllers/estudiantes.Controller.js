//---------------------------------------------------------------------------------------------------------------
// Archivo: gestionEstudiantes.js
// Descripción general: 
// Este archivo contiene funciones para gestionar la información académica de los estudiantes:
// obtener datos de perfil, carreras disponibles, oportunidades activas, registrar postulaciones
// y hacer seguimiento de las solicitudes registradas.
//---------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------
// Importación de servicios de correos, conexión a Firestore y utilidades necesarias
//---------------------------------------------------------------------------------------------------------------
import { transporter } from "../Services/emails.js";
import { Timestamp } from 'firebase/firestore';
import { db, app } from "../Services/fireBaseConnect.js";
import { collection, getDocs, updateDoc, doc, getDoc, addDoc, query, where, arrayUnion} from "firebase/firestore";

//---------------------------------------------------------------------------------------------------------------
// Función que busca la información de un estudiante específico después del login
//---------------------------------------------------------------------------------------------------------------
export const informacionEstudiante = async (req, res) => {
  const { userId } = req.query;
  try {
    let carrera = '';
    const userDoc = await getDoc(doc(db, "Usuarios", userId)); // Buscar usuario por ID
    const escuelaDoc = await getDocs(collection(db, "Usuarios")); // Obtener todas las escuelas

    if (!userDoc.exists()) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const datos = userDoc.data();

    // Obtener nombres de cursos aprobados
    const cursosNombres = [];
    if (Array.isArray(datos.cursosAprovados)) {
      for (const idCurso of datos.cursosAprovados) {
        const cursoDoc = await getDoc(doc(db, "Cursos", idCurso));
        if (cursoDoc.exists()) {
          cursosNombres.push(cursoDoc.data().nombre || idCurso);
        } else {
          cursosNombres.push(idCurso);
        }
      }
    }

    // Buscar el nombre de la carrera correspondiente
    for(const docs of escuelaDoc.docs){
      const datos1 = docs.data();
      if(docs.id === datos.carrera){
        carrera = datos1.carrera;
      }
    }

    const respuesta = {
      ...datos,
      carrera: carrera,
      cursosAprovados: cursosNombres
    };

    return res.status(200).json({ datos: respuesta });
  } catch (error) {
    console.error("Error al obtener la información del estudiante:", error);
    return res.status(500).json({ error: "Error al obtener la información del estudiante" });
  }
};

//---------------------------------------------------------------------------------------------------------------
// Función que busca todas las carreras registradas
//---------------------------------------------------------------------------------------------------------------
export const obtenerCarreras = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "Usuarios"));
    const carrerasSet = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.tipoUsuario === "Escuela" && data.carrera) {
        carrerasSet.add(data.carrera.trim());
      }
    });

    return res.status(200).json({ carreras: Array.from(carrerasSet) }); // Convertir Set a Array
  } catch (error) {
    console.error("Error al extraer carreras:", error);
    return res.status(500).json({ error: "Error al extraer las carreras" });
  }
};

//---------------------------------------------------------------------------------------------------------------
// Función que registra el perfil académico de un estudiante (carrera, nivel académico y promedio)
//---------------------------------------------------------------------------------------------------------------
export const registrarPerfilAcademico = async (req, res) => {
  const { userId, carrera, nivelAcademico, promedio } = req.body;

  console.log("Datos recibidos en registrarPerfilAcademico:", userId, carrera, nivelAcademico, promedio);

  try {
    const ref = doc(db, "Usuarios", userId);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    // Actualizar campos del perfil académico
    await updateDoc(ref, {
      carrera: carrera || "",
      nivelAcademico: nivelAcademico || "",
      ponderado: promedio || ""
    });

    return res.status(200).json({ message: "Perfil académico registrado" });
  } catch (error) {
    console.error("Error en Firestore:", error);
    return res.status(500).json({ error: "Error al registrar perfil académico" });
  }
};

//---------------------------------------------------------------------------------------------------------------
// Función que obtiene todas las oportunidades (asistencias, proyectos, tutorías) disponibles
//---------------------------------------------------------------------------------------------------------------
export const obtenerOportunidades = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "Asistencias"));
    const usuariosSnapshot = await getDocs(collection(db, "Usuarios"));

    // Mapa para obtener nombres de usuarios por ID
    const usuariosMap = {};
    usuariosSnapshot.forEach(doc => {
      const data = doc.data();
      usuariosMap[doc.id] = data.nombre;
    });

    // Filtrar solo oportunidades abiertas
    const oportunidades = snapshot.docs
      .filter(doc => doc.data().estado !== "Cerrado")
      .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        titulo: data.tituloPrograma || "Sin título",
        escuela: usuariosMap[data.departamento] || "Desconocido",
        encargado: usuariosMap[data.personaACargo] || "Sin encargado",
        horas: `${data.totalHoras || "0"} horas mínimas a la semana`,
        requisitos: Array.isArray(data.requisitos) ? data.requisitos.join(', ') : "Sin requisitos",
        descripcion: data.descripcion || "",
        tipo: data.tipo || "",
        estado: data.estado || "",
        horario: data.horario || "Sin horario definido",
        cantidadVacantes: data.cantidadVacantes || "0",
        cantidadSolicitudes: data.cantidadSolicitudes || "0",
        objetivos: data.objetivos || "No especificados",
        beneficio: data.beneficio || "No aplica",
        promedioRequerido: data.promedioRequerido || "No especificado",
        semestre: data.semestre || "No definido",
        fechaInicio: data.fechaInicio || "No definida",
        fechaFin: data.fechaFin || "No definida",
        totalHoras: data.totalHoras || "0"
      };
    });

    return res.status(200).json({ oportunidades });

  } catch (error) {
    console.error("Error al obtener oportunidades:", error);
    return res.status(500).json({ error: "No se pudieron obtener las oportunidades" });
  }
};

//---------------------------------------------------------------------------------------------------------------
// Función que registra la solicitud de un estudiante para una oportunidad específica
//---------------------------------------------------------------------------------------------------------------
export const registrarSolicitud = async (req, res) => {
  const {
    nombre, correo, telefono, promedio, horas, nota,
    comentarios, documento, tituloOportunidad, userId
  } = req.body;

  try {
    // 1. Guardar solicitud en colección 'Solicitudes'
    await addDoc(collection(db, 'Solicitudes'), {
      nombre,
      correo,
      telefono,
      promedio,
      horas,
      nota,
      comentarios,
      documento,
      tituloOportunidad,
      userId,
      estado: 'Pendiente',
      fecha: Timestamp.now()
    });

    // 2. Buscar oportunidad relacionada
    const asistenciasQuery = query(collection(db, 'Asistencias'), where('tituloPrograma', '==', tituloOportunidad));
    const snapshot = await getDocs(asistenciasQuery);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      const data = snapshot.docs[0].data();
      const cantidadActual = parseInt(data.cantidadSolicitudes || 0);

      // 3. Actualizar postulaciones y cantidad de solicitudes
      await updateDoc(docRef, {
        postulaciones: arrayUnion(userId),
        cantidadSolicitudes: cantidadActual + 1
      });
    }

    return res.status(200).json({ mensaje: 'Solicitud registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar la solicitud:', error);
    return res.status(500).json({ error: 'Error al registrar la solicitud' });
  }
};

//---------------------------------------------------------------------------------------------------------------
// Función que obtiene el seguimiento de las solicitudes registradas por un estudiante
//---------------------------------------------------------------------------------------------------------------
export const seguimientoSolicitudes = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'Falta el ID del usuario' });
    }

    const solicitudesRef = collection(db, 'Solicitudes');
    const asistenciasRef = collection(db, 'Asistencias');
    const usuariosRef = collection(db, 'Usuarios');

    // Obtener solicitudes del estudiante
    const q = query(solicitudesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const asistencias = await getDocs(asistenciasRef);
    const usuarios = await getDocs(usuariosRef);

    const solicitudesMap = new Map();

    for (const doc of querySnapshot.docs) {
      const data = doc.data();

      if (!data.tituloOportunidad || solicitudesMap.has(doc.id)) continue;

      let tipoBeca = 'Sin tipo';
      let periodo = 'Sin periodo';
      let responsable = 'No asignado';

      // Buscar tipo y responsable de la oportunidad
      for (const asistencia of asistencias.docs) {
        const a = asistencia.data();
        if (a.tituloPrograma === data.tituloOportunidad) {
          tipoBeca = a.tipo || 'Sin tipo';
          periodo = a.semestre || 'Sin periodo';

          const usuario = usuarios.docs.find(u => u.id === a.personaACargo);
          responsable = usuario?.data()?.nombre || 'No asignado';
        }
      }

      solicitudesMap.set(doc.id, {
        id: doc.id,
        titulo: data.tituloOportunidad || 'Sin título',
        tipoBeca,
        periodo,
        responsable,
        estado: data.estado || 'Pendiente',
        horasTrabajadas: parseInt(data.horas) || 0,
        avances: false,
        retroalimentacion: false,
        certificados: false,
      });
    }

    const resultado = Array.from(solicitudesMap.values());
    console.log("Solicitudes enviadas al frontend:", resultado);

    return res.status(200).json({ solicitudes: resultado });
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error);
    return res.status(500).json({ error: 'Error al obtener las solicitudes' });
  }
};
