import { transporter } from "../Services/emails.js";
import { Timestamp } from 'firebase/firestore';
import { db, app } from "../Services/fireBaseConnect.js";
import { collection, getDocs, updateDoc, doc, getDoc, addDoc, query, where, arrayUnion} from "firebase/firestore";



//---------------------------------------------------------------------------------------------------------------
// Funcion que busca la informacion de un estudiante especiico, luego de ser ingresado la informacion del login
//----------------------------------------------------------------------------------------------------------------

export const informacionEstudiante = async (req, res) => {
  const { userId } = req.query;
  try {
    let carrera = '';
    const userDoc = await getDoc(doc(db, "Usuarios", userId));
    const escuelaDoc = await getDocs(collection(db, "Usuarios"));
    if (!userDoc.exists()) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const datos = userDoc.data();

    // Obtener nombres de cursos aprobados si existen
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
// Funcion que busca la informacion de todas las carreras
//----------------------------------------------------------------------------------------------------------------

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

    return res.status(200).json({ carreras: Array.from(carrerasSet) });
  } catch (error) {
    console.error("Error al extraer carreras:", error);
    return res.status(500).json({ error: "Error al extraer las carreras" });
  }
};

//---------------------------------------------------------------------------------------------------------------
// Funcion crea con correo institucional, ingreso de carrera y nivel, carga de documentos, sincronización de notas
//  y promedio a un estudiante 
//----------------------------------------------------------------------------------------------------------------

export const registrarPerfilAcademico = async (req, res) => {
  const { userId, carrera, nivelAcademico, promedio } = req.body;

  console.log("Datos recibidos en registrarPerfilAcademico:");
  console.log("userId:", userId);
  console.log("carrera:", carrera);
  console.log("nivelAcademico:", nivelAcademico);
  console.log("promedio:", promedio);

  try {
    const ref = doc(db, "Usuarios", userId);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

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
// Funcion que obtiene todas las oportunidades que existen ya aprobadas
//----------------------------------------------------------------------------------------------------------------

export const obtenerOportunidades = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "Asistencias"));
    const usuariosSnapshot = await getDocs(collection(db, "Usuarios"));

    const usuariosMap = {};
    usuariosSnapshot.forEach(doc => {
      const data = doc.data();
      usuariosMap[doc.id] = data.nombre;
    });

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
// Funcion que registra la solicitud de un estudiante a una Asistencia especifica 
//----------------------------------------------------------------------------------------------------------------
export const registrarSolicitud = async (req, res) => {
  const {
    nombre, correo, telefono, promedio, horas, nota,
    comentarios, documento, tituloOportunidad, userId
  } = req.body;

  try {
    // 1. Guardar la solicitud
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

    // 2. Buscar la oportunidad en Asistencias por título
    const asistenciasQuery = query(collection(db, 'Asistencias'), where('tituloPrograma', '==', tituloOportunidad));
    const snapshot = await getDocs(asistenciasQuery);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      const data = snapshot.docs[0].data();

      const cantidadActual = parseInt(data.cantidadSolicitudes || 0);

      // 3. Actualizar postulaciones y cantidadSolicitudes
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
// Funcion que registra el seguimiento de las solicitudes 
//----------------------------------------------------------------------------------------------------------------

export const seguimientoSolicitudes = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'Falta el ID del usuario' });
    }

    // Obtener referencias necesarias
    const solicitudesRef = collection(db, 'Solicitudes');
    const asistenciasRef = collection(db, 'Asistencias');
    const usuariosRef = collection(db, 'Usuarios');

    // Obtener las solicitudes del estudiante
    const q = query(solicitudesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const asistencias = await getDocs(asistenciasRef);
    const usuarios = await getDocs(usuariosRef);

    const solicitudesMap = new Map();

    for (const doc of querySnapshot.docs) {
      const data = doc.data();

      // Evitar duplicados por ID (más confiable que título)
      if (!data.tituloOportunidad || solicitudesMap.has(doc.id)) continue;

      let tipoBeca = 'Sin tipo';
      let periodo = 'Sin periodo';
      let responsable = 'No asignado';

      // Buscar el tipo y responsable en la colección de asistencias
      for (const asistencia of asistencias.docs) {
        const a = asistencia.data();
        if (a.tituloPrograma === data.tituloOportunidad) {
          tipoBeca = a.tipo || 'Sin tipo';
          periodo = a.semestre || 'Sin periodo';

          // Buscar nombre del profesor responsable
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
