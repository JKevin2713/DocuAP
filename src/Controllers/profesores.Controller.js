import { Timestamp } from 'firebase/firestore';
import { db, app } from "../Services/fireBaseConnect.js";
import { collection, getDocs, updateDoc, doc, getDoc, addDoc, query, where, deleteDoc, arrayUnion} from "firebase/firestore";


export const getInfoProfesores = async (req, res) => {
  const { id } = req.params;
  try {
    const docRef = doc(db, "Usuarios", id);
    const docSnap = await getDoc(docRef);

    console.log("Entro al controlador de profesores");
    if (docSnap.exists()) {
      const { contrasena, ...filteredInfo } = docSnap.data();
      res.status(200).json({ id: docSnap.id, ...filteredInfo });
    } else {
      res.status(404).json({ message: "No such document!" });
    }
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ message: "Error getting document" });
  }
}

export const updateInfoProfesores = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, telefono, sede, password } = req.body;
    try {
        const docRef = doc(db, "Usuarios", id);
        await updateDoc(docRef, {
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            sede: sede,
            contrasena: password
        });
        res.status(200).json({ message: "Document successfully updated!" });
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ message: "Error updating document" });
    }
}

export const getAllCourses = async (req, res) => {

    const { id } = req.params;
    try { 
        const cursosRef = collection(db, "Cursos");
        const q = query(cursosRef, where("profesor", "==", id));
        const querySnapshot = await getDocs(q);
        const cursos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (cursos.length > 0) {
            res.status(200).json(cursos);
        } else {
            res.status(404).json({ message: "No courses found for this professor" });
        }
    } catch (error) {
        console.error("Error getting document:", error);
        res.status(500).json({ message: "Error getting document" });
    }

}

export const getAllHistorial = async (req, res) => {
    const { id } = req.params;
    try {
        const asistenciasRef = collection(db, "Asistencias");
        const q = query(asistenciasRef, where("personaACargo", "==", id));
        const querySnapshot = await getDocs(q);
        const cursos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (cursos.length > 0) {
            res.status(200).json(cursos);
        } else {
            res.status(404).json({ message: "No courses found for this professor" });
        }
    } catch (error) {
        console.error("Error getting document:", error);
        res.status(500).json({ message: "Error getting document" });
    }

}

export const getUserInfoByAsistencias = async (req, res) => {
  const { id } = req.params;

  try {
    const asistenciasRef = collection(db, "Asistencias");
    const q = query(asistenciasRef, where("personaACargo", "==", id));
    const querySnapshot = await getDocs(q);
    const asistenciaIds = querySnapshot.docs.map(doc => doc.id);

    if (asistenciaIds.length === 0) {
      return res.status(404).json({ message: "No se encontraron asistencias para este profesor." });
    }
    const asignadasRef = collection(db, "AsistenciasAsignadas");
    const chunks = [];
    const idsCopy = [...asistenciaIds];
    while (idsCopy.length) chunks.push(idsCopy.splice(0, 10));

    const asistenciasRelacionadas = [];
    for (const chunk of chunks) {
      const qAsign = query(asignadasRef, where("asistenciaId", "in", chunk));
      const snapAsign = await getDocs(qAsign);
      for (const asignDoc of snapAsign.docs) {
        const dataAsign = asignDoc.data();
        const asistId = dataAsign.asistenciaId;
        const asistDoc = await getDoc(doc(db, "Asistencias", asistId));
        if (asistDoc.exists()) {
          asistenciasRelacionadas.push({
            asignacionId: asignDoc.id,
            datosAsignacion: dataAsign,
            datosAsistencia: asistDoc.data(),
          });
        }
      }
    }

    const cerradasQ = query(
      asistenciasRef,
      where("personaACargo", "==", id),
      where("estado", "==", "Cerrado")
    );
    const cerradasSnap = await getDocs(cerradasQ);
    const asistenciasCerradas = cerradasSnap.docs.map(doc => ({
      asistenciaId: doc.id,
      datosAsistencia: doc.data(),
    }));

    const titulosAsignadas = new Set(
      asistenciasRelacionadas.map(a => a.datosAsistencia.tituloPrograma.trim().toLowerCase())
    );
    const cerradasFiltradas = asistenciasCerradas.filter(c => {
      const titulo = c.datosAsistencia.tituloPrograma.trim().toLowerCase();
      return !titulosAsignadas.has(titulo);
    });


    return res.status(200).json({
      asignadas: asistenciasRelacionadas,
      cerradas: cerradasFiltradas
    });

  } catch (error) {
    console.error("Error obteniendo asistencias:", error);
    return res.status(500).json({ message: "Error obteniendo documentos." });
  }
};




export const insertNewOferta = async (req, res) => {
  const {
      beneficios,
      descripcion,
      fechaCierre,  // Corresponde a fechaFin en DB
      fechaInicio,
      horario,
      horasSemanal, // Corresponde a horaXSemana en DB
      nombrePrograma, // Corresponde a tituloPrograma en DB
      objetivos,
      requisitos,
      tipo,
      vacantes, // Corresponde a cantidadVacantes en DB
      estado,
      semestre,
      departamento,
      promedioRequerido,
      totalHoras,
      requisitosAdicionales
  } = req.body;

  const { id } = req.params;

  // Función para formatear fechas a DD/MM/YYYY
  const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
  };

  try {
      const asistenciasRef = collection(db, "Asistencias");
      const newDoc = await addDoc(asistenciasRef, {
          beneficio: beneficios, // Mapeo correcto
          descripcion: descripcion,
          fechaFin: formatDate(fechaCierre), // Usar fechaCierre como fechaFin
          fechaInicio: formatDate(fechaInicio),
          horario: horario,
          horaXSemana: horasSemanal.toString(), // Guardar como string
          tituloPrograma: nombrePrograma,
          objetivos: objetivos,
          requisitos: requisitos.split(',').map(item => item.trim()), // Convertir a array
          tipo: tipo,
          cantidadVacantes: vacantes.toString(), // Guardar como string
          semestre: semestre,
          personaACargo: id,
          estado: estado,
          cantidadSolicitudes: 0, // Número, no string
          departamento: departamento,
          promedioRequerido: promedioRequerido,
          totalHoras: totalHoras,
          requisitosAdicionales: requisitosAdicionales,
          postulaciones: [], // Inicializar array
          historialCambios: [{
              cambios: "Creación de la oferta",
              fecha: formatDate(new Date().toISOString().split('T')[0]),
              horaXSemana: horasSemanal.toString()
          }] // Historial inicial
      });

      res.status(200).json({ message: "Oferta creada exitosamente", id: newDoc.id });
  } catch (error) {
      console.error("Error inserting new oferta:", error);
      res.status(500).json({ message: "Error inserting new oferta" });
  }
}

export const getAsistenciasByProfesor = async (req, res) => {
    const { id } = req.params;
    try {
        const asistenciasRef = collection(db, "Asistencias");
        const q = query(asistenciasRef, where("personaACargo", "==", id));
        const querySnapshot = await getDocs(q);
        const asistencias = querySnapshot.docs.map(doc => ({
            asistenciaId: doc.id,
            ...doc.data()
        }));
        if (asistencias.length > 0) {
            res.status(200).json(asistencias);
        } else {
            res.status(404).json({ message: "No asistencias found for this professor" });
        }
    } catch (error) {
        console.error("Error getting document:", error);
        res.status(500).json({ message: "Error getting document" });
    }
}

export const getSolicitudesRelacionadasConAsistencias = async (req, res) => {
  try {
    const asistenciasSnapshot = await getDocs(collection(db, "Asistencias"));
    
    const asistenciaTitles = asistenciasSnapshot.docs
      .map((doc) => {
        const titulo = doc.data().tituloPrograma;
        return titulo ? titulo.trim().toLowerCase() : null;
      })
      .filter(Boolean);
    const normalizedTitles = new Set(asistenciaTitles);

    if (normalizedTitles.size === 0) {
      return res.status(404).json({ 
        message: "No hay títulos de programa registrados en la colección Asistencias." 
      });
    }
    const solicitudesSnapshot = await getDocs(collection(db, "Solicitudes"));
    
    const solicitudesRelacionadas = [];
    solicitudesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.tituloOportunidad) {
        const normalizedOportunidad = data.tituloOportunidad.trim().toLowerCase();
        if (normalizedTitles.has(normalizedOportunidad)) {
          solicitudesRelacionadas.push({
            id: doc.id,
            ...data
          });
        }
      }
    });

    if (solicitudesRelacionadas.length === 0) {
      return res.status(404).json({ 
        message: "No se encontraron solicitudes relacionadas con los títulos de las asistencias." 
      });
    }

    res.status(200).json(solicitudesRelacionadas);
  } catch (error) {
    console.error("Error obteniendo las solicitudes relacionadas:", error);
    res.status(500).json({ message: "Error al buscar solicitudes relacionadas." });
  }
};

  export const updateOferta = async (req, res) => {
    const { id } = req.params; 
    const updatedData = req.body; 
    
    try {
      const docRef = doc(db, "Asistencias", id); 
      await updateDoc(docRef, updatedData); 
  
      res.status(200).json({ message: "Oferta actualizada exitosamente!" });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Error al actualizar la oferta.", error: error.message });
    }
  }

  export const closeOferta = async (req, res) => {
    const { id } = req.params;
    console.log("ID de la oferta a cerrar:", id); 
    try {
        const docRef = doc(db, "Asistencias", id);
        await updateDoc(docRef, {
            estado: "Cerrado"
        });
        res.status(200).json({ message: "Oferta cerrada exitosamente." });
    } catch (error) {
        console.error("Error al cerrar la oferta:", error);
        res.status(500).json({ message: "Error al cerrar la oferta." });
    }
};

export const deleteOferta = async (req, res) => {
    const { id } = req.params;

    try {
        const docRef = doc(db, "Ofertas", id);
        await deleteDoc(docRef);
        res.status(200).json({ message: "Oferta eliminada exitosamente." });
    } catch (error) {
        console.error("Error al eliminar la oferta:", error);
        res.status(500).json({ message: "Error al eliminar la oferta." });
    }
};


export const addDesempeno = async (req, res) => {
    const { id } = req.params; 
    const { desempeno, retroalimentacion } = req.body; 

    try {
        const docRef = doc(db, "AsistenciasAsignadas", id); 

        
        await updateDoc(docRef, {
            desempeno: desempeno, 
            retroalimentacion: retroalimentacion 
        });

        res.status(200).json({ message: "Desempeño y retroalimentación agregados exitosamente." });
    } catch (error) {
        console.error("Error al agregar el desempeño y retroalimentación:", error);
        res.status(500).json({ message: "Error al agregar el desempeño y retroalimentación." });
    }
};


export const searchCarreraByuserId = async (req, res) => {
  const { id } = req.params; 
  try {
    const userDocRef = doc(db, "Usuarios", id);
    const userDocSnap = await getDoc(userDocRef);

    console.log("Entro al controlador de profesores");
    if (userDocSnap.exists()) {
      const { contrasena, carrera, ...filteredInfo } = userDocSnap.data();

      if (!carrera) {
        return res.status(404).json({ message: "No se encontró la carrera asociada al usuario." });
      }

      const carreraDocRef = doc(db, "Usuarios", carrera);
      const carreraDocSnap = await getDoc(carreraDocRef);
      if (!carreraDocSnap.exists()) {
        return res.status(404).json({ message: "No se encontró la carrera." });
      }

      const { carrera: carreraField } = carreraDocSnap.data();

      res.status(200).json({
        id: userDocSnap.id,
        ...filteredInfo,
        carrera: carreraField
      });
    } else {
      res.status(404).json({ message: "No such document!" });
    }
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ message: "Error getting document" });
  }
};

export const updatePostulacionAcciones = async (req, res) => {
  const { userId } = req.params;
  const { titulo, estado, reunion } = req.body;

  try {
    const solicitudesRef = collection(db, "Solicitudes");
    const q = query(
      solicitudesRef,
      where("userId", "==", userId),
      where("tituloOportunidad", "==", titulo.trim().toLowerCase())
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No se encontró la postulación." });
    }

    const docSnap = querySnapshot.docs[0];
    const updateData = {};

    if (estado) updateData.estado = estado;
    if (reunion !== undefined) updateData.reunion = reunion;
    
    await updateDoc(doc(db, "Solicitudes", docSnap.id), updateData);
    return res.status(200).json({ message: "Postulación actualizada exitosamente." });
  } catch (error) {
    console.error("Error updating postulación:", error);
    return res.status(500).json({ message: "Error updating postulación." });
  }
};

export const updateAsistenciaFeedback = async (req, res) => {
  const { type, id } = req.params;
  const { retroalimentacion, desempeno } = req.body;

  //console.log("[updateAsistenciaFeedback] params:", { type, id });
  //console.log("[updateAsistenciaFeedback] body:", { retroalimentacion, desempeno });

  try {
    let docRef;
    if (type === "asignada") {
      docRef = doc(db, "AsistenciasAsignadas", id);
    } else if (type === "cerrada") {
      docRef = doc(db, "Asistencias", id);
    } else {
      console.log("[updateAsistenciaFeedback] Tipo inválido:", type);
      return res.status(400).json({ message: "Tipo inválido" });
    }
    const beforeSnap = await getDoc(docRef);
    if (!beforeSnap.exists()) {
      //console.log("[updateAsistenciaFeedback] Documento no existe:", id);
      return res.status(404).json({ message: "Documento no encontrado" });
    }
    //console.log("[updateAsistenciaFeedback] Antes:", beforeSnap.data());

    await updateDoc(docRef, {
      retroalimentacion,
      desempeno
    });
    //console.log("[updateAsistenciaFeedback] updateDoc() completado");

    const afterSnap = await getDoc(docRef);
    //console.log("[updateAsistenciaFeedback] Después:", afterSnap.data());

    return res.status(200).json({ message: "Feedback guardado correctamente." });
  } catch (error) {
    console.error("Error en updateAsistenciaFeedback:", error);
    return res.status(500).json({ message: "Error interno." });
  }
};


export const assignAndRemoveSolicitud = async (req, res) => {
  const student = req.body;
  console.log("[assignAndRemoveSolicitud] body:", student);

  const {
    userId,
    tituloOportunidad,
    pago = 2000,
    retroalimentacion = "",
    desempeno = "",
    fechaAsignacion = Timestamp.now(),
    activo = true
  } = student;

  try {
    const buscado = tituloOportunidad.trim().toLowerCase();
    //console.log("Buscando (normalizado):", buscado);
    const asistSnap = await getDocs(collection(db, "Asistencias"));
    //console.log("Total asistencias en BD:", asistSnap.size);

    const candidatos = asistSnap.docs.filter(d => {
      const data = d.data();
      const tituloBD = String(data.tituloPrograma || "").trim().toLowerCase();
      const estadoBD = String(data.estado || "").trim().toLowerCase();
      return tituloBD === buscado && estadoBD === "abierto";
    });
    //console.log("Asistencias que cumplen título+estado:", candidatos.length);

    if (candidatos.length === 0) {
      return res.status(404).json({ message: "No existe Asistencia abierta con ese título." });
    }

    const asistDoc = candidatos[0];
    const asistenciaId = asistDoc.id;
    //console.log("Usando asistenciaId:", asistenciaId);

    const newAsign = {
      asistenciaId,
      userId,
      pago,
      retroalimentacion,
      desempeno,
      fechaAsignacion,
      activo
    };
    //console.log("Insertando en AsistenciasAsignadas:", newAsign);
    await addDoc(collection(db, "AsistenciasAsignadas"), newAsign);

    const solSnap = await getDocs(collection(db, "Solicitudes"));
    const solABorrar = solSnap.docs.filter(d => {
      const s = d.data();
      return String(s.userId) === userId
          && String(s.tituloOportunidad).trim().toLowerCase() === buscado;
    });
    //console.log("Solicitudes a borrar:", solABorrar.length);
    for (const d of solABorrar) {
      //console.log("– borrando solicitud", d.id);
      await deleteDoc(doc(db, "Solicitudes", d.id));
    }

    return res.status(200).json({ message: "Estudiante asignado y solicitud eliminada." });
  } catch (err) {
    console.error("Error en assignAndRemoveSolicitud:", err);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const setSolicitudReunion = async (req, res) => {
  const { id } = req.params;
  try {
    const docRef = doc(db, "Solicitudes", id);
    await updateDoc(docRef, { reunion: true });
    res.status(200).json({ message: "Reunión solicitada en la postulación." });
  } catch (error) {
    console.error("Error setSolicitudReunion:", error);
    res.status(500).json({ message: "Error al solicitar reunión." });
  }
};

export const rechazarPostulacion = async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = doc(db, "Solicitudes", id);
    await updateDoc(docRef, {estado: "Rechazado"});
    res.status(200).json({ message: "Reunión solicitada en la postulación." });

  } catch (error) {
    console.error("Error al rechazar postulación:", error);
    return res.status(500).json({ message: "Error al rechazar postulación" });
  }
};


export const updateSeguimiento = async (req, res) => {
  const { id } = req.params;
  const {
    tutoriasCumplidas,
    asistenciasCumplidas,
    cumplimientoTareas,
    tutoriasPorCumplir,
    asistenciasPorCumplir,
    tareasPorCumplir
  } = req.body;

  try {
    const docRef = doc(db, "AsistenciasAsignadas", id);
    await updateDoc(docRef, {
      tutoriasCumplidas: tutoriasCumplidas,
      asistenciasCumplidas: asistenciasCumplidas,
      cumplimientoTareas: cumplimientoTareas,
      tutoriasCumplidas: tutoriasPorCumplir,
      asistenciasCumplidas: asistenciasPorCumplir,
      tareasPorCumplir: tareasPorCumplir
    });
    res.status(200).json({ message: "Seguimiento actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar seguimiento:", error);
    res.status(500).json({ message: "Error al actualizar seguimiento" });
  }
};