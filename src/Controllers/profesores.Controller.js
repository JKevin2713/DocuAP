import { Timestamp } from 'firebase/firestore';
import { db, app } from "../Services/fireBaseConnect.js";
import { collection, getDocs, updateDoc, doc, getDoc, addDoc, query, where, deleteDoc, arrayUnion} from "firebase/firestore";

/** 
 * Controlador para obtener la información de un profesor específico.
 * 1. Obtiene el ID del profesor desde los parámetros de la URL (req.params).
 * 2. Intenta acceder al documento correspondiente en la colección "Usuarios" de Firestore.
 * 3. Si el documento existe:
 *    - Filtra la propiedad sensible 'contrasena' para no enviarla al cliente
 *    - Devuelve el resto de la información del usuario junto con el ID del documento
 * 4. Si el documento no existe, devuelve un error 404
 * 5. Maneja posibles errores durante el proceso devolviendo un error 500
 * 
*/

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
/** 
 * Controlador para actualizar la información de un profesor específico.
 * 1. Obtiene el ID del profesor desde los parámetros de la URL (req.params).
 * 2. Extrae los datos del cuerpo de la solicitud (req.body).
 * 3. Intenta acceder al documento correspondiente en la colección "Usuarios" de Firestore.
 * 4. Actualiza el documento con los nuevos datos proporcionados.
 * 5. Si la actualización es exitosa, devuelve un mensaje de éxito.
 * 6. Si ocurre un error durante la actualización, devuelve un error 500.
 * 7. Maneja posibles errores durante el proceso devolviendo un error 500
 * 
*/
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

/**
 * Controlador para obtener todos los cursos de un profesor específico.
 *  1. Obtiene el ID del profesor desde los parámetros de la URL (req.params).
 *  2. Intenta acceder a la colección "Cursos" de Firestore.
 *  3. Realiza una consulta para obtener todos los cursos donde el campo "profesor" sea igual al ID del profesor.
 *  4. Si se encuentran cursos, los devuelve en la respuesta con un estado 200.
 *  5. Si no se encuentran cursos, devuelve un mensaje de error 404.
 *  6. Maneja posibles errores durante el proceso devolviendo un error 500.
 * 
 */
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

/**
 * Controlador para obtener el historial de asistencias de un profesor específico.
 * 1. Obtiene el ID del profesor desde los parámetros de la URL (req.params).
 * 2. Intenta acceder a la colección "Asistencias" de Firestore.
 * 3. Realiza una consulta para obtener todos los cursos donde el campo "personaACargo" sea igual al ID del profesor.
 * 4. Si se encuentran cursos, los devuelve en la respuesta con un estado 200.
 * 5. Si no se encuentran cursos, devuelve un mensaje de error 404.
 * 6. Maneja posibles errores durante el proceso devolviendo un error 500.
 * 
 */
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

/** 
 * Controlador para obtener información de asistencias relacionadas con un profesor específico.
 * 1. Obtiene el ID del profesor desde los parámetros de la URL
 * 2. Busca en la colección "Asistencias" todas las asistencias donde el profesor es personaACargo
 * 3. Si no encuentra asistencias, devuelve error 404
 * 4. Divide los IDs encontrados en grupos de 10 (límite de cláusula 'in' en Firestore)
 * 5. Consulta en "AsistenciasAsignadas" las relaciones con esos IDs por bloques
 * 6. Combina datos de asignaciones con sus respectivas asistencias
 * 7. Busca asistencias cerradas del mismo profesor
 * 8. Filtra las cerradas que no tienen versión asignada mediante comparación de títulos
 * 9. Devuelve estructura organizada con asignaciones activas y cerradas filtradas
 * 
 */
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


/**
 * Controlador para insertar una nueva oferta de asistencia.
  * 1. Extrae los datos del cuerpo de la solicitud (req.body).
  * 2. Formatea las fechas a un formato específico (DD/MM/YYYY).
  * 3. Intenta acceder a la colección "Asistencias" de Firestore.
  * 4. Crea un nuevo documento con los datos proporcionados.
  * 5. Si la inserción es exitosa, devuelve un mensaje de éxito y el ID del nuevo documento.
  * 6. Si ocurre un error durante la inserción, devuelve un error 500.
  * 7. Maneja posibles errores durante el proceso devolviendo un error 500.
  * 
 */

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

/** 
 * Controlador para obtener asistencias relacionadas con un profesor específico.
 * 1. Obtiene el ID del profesor desde los parámetros de la URL (req.params).
 * 2. Intenta acceder a la colección "Asistencias" de Firestore.
 * 3. Realiza una consulta para obtener todas las asistencias donde el campo "personaACargo" sea igual al ID del profesor.
 * 4. Si se encuentran asistencias, las devuelve en la respuesta con un estado 200.
 * 5. Si no se encuentran asistencias, devuelve un mensaje de error 404.
 * 6. Maneja posibles errores durante el proceso devolviendo un error 500.
 */
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

/** 
 * Controlador para obtener solicitudes relacionadas con asistencias.
 * 1. Obtiene todas las asistencias de la colección "Asistencias".
 * 2. Normaliza los títulos de los programas de las asistencias.
 * 3. Si no hay títulos registrados, devuelve un error 404.
 * 4. Obtiene todas las solicitudes de la colección "Solicitudes".
 * 5. Filtra las solicitudes que tienen títulos relacionados con las asistencias.
 * 6. Si no se encuentran solicitudes relacionadas, devuelve un error 404.
 * 7. Devuelve las solicitudes relacionadas en la respuesta con un estado 200.
 * 8. Maneja posibles errores durante el proceso devolviendo un error 500.
 *  
*/
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


/**
 * Controlador para actualizar una oferta de asistencia.
 * 1. Obtiene el ID de la oferta desde los parámetros de la URL (req.params).
 * 2. Extrae los datos del cuerpo de la solicitud (req.body).
 * 3. Intenta acceder al documento correspondiente en la colección "Asistencias" de Firestore.
 * 4. Actualiza el documento con los nuevos datos proporcionados.
 * 5. Si la actualización es exitosa, devuelve un mensaje de éxito.
 * 6. Si ocurre un error durante la actualización, devuelve un error 500.
 * 7. Maneja posibles errores durante el proceso devolviendo un error 500.
 *  
 */
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

  /**
  * Controlador para cerrar una oferta de asistencia.
  * 1. Obtiene el ID de la oferta desde los parámetros de la URL (req.params).
  * 2. Intenta acceder al documento correspondiente en la colección "Asistencias" de Firestore.
  * 3. Actualiza el estado de la oferta a "Cerrado".
  * 4. Si la actualización es exitosa, devuelve un mensaje de éxito.
  * 5. Si ocurre un error durante la actualización, devuelve un error 500.
  * 6. Maneja posibles errores durante el proceso devolviendo un error 500.
  *   
   */
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

/** 
 * Controlador para eliminar una oferta de asistencia.
 * 1. Obtiene el ID de la oferta desde los parámetros de la URL (req.params).
 * 2. Intenta acceder al documento correspondiente en la colección "Ofertas" de Firestore.
 * 3. Elimina el documento de la colección.
 * 4. Si la eliminación es exitosa, devuelve un mensaje de éxito.
 * 5. Si ocurre un error durante la eliminación, devuelve un error 500.
 * 6. Maneja posibles errores durante el proceso devolviendo un error 500.
 *  
 */
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

/** 
 * Controlador para agregar desempeño y retroalimentación a una asistencia asignada.
 * 1. Obtiene el ID de la asistencia desde los parámetros de la URL (req.params).
 * 2. Extrae el desempeño y la retroalimentación del cuerpo de la solicitud (req.body).
 * 3. Intenta acceder al documento correspondiente en la colección "AsistenciasAsignadas" de Firestore.
 * 4. Actualiza el documento con los nuevos datos proporcionados.
 * 5. Si la actualización es exitosa, devuelve un mensaje de éxito.
 * 6. Si ocurre un error durante la actualización, devuelve un error 500.
 * 7. Maneja posibles errores durante el proceso devolviendo un error 500.
 */
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

/** 
 * Controlador para buscar la carrera asociada a un usuario específico.
 * 1. Obtiene el ID del usuario desde los parámetros de la URL (req.params).  
 * 2. Intenta acceder al documento correspondiente en la colección "Usuarios" de Firestore.
 * 3. Si el documento existe, filtra la propiedad sensible 'contrasena' para no enviarla al cliente.
 * 4. Verifica si el campo 'carrera' existe y no está vacío.
 * 5. Si la carrera existe, busca el documento correspondiente en la colección "Usuarios" usando el ID de la carrera.
 * 6. Si se encuentra la carrera, devuelve la información del usuario junto con el nombre de la carrera.
 * 7. Si no se encuentra la carrera, devuelve un error 404.
 * 8. Si el documento no existe, devuelve un error 404.
 * 9. Maneja posibles errores durante el proceso devolviendo un error 500.
 * 
*/
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

/**
 * Controlador para actualizar el estado de una postulación.
 * 1. Obtiene el ID del usuario desde los parámetros de la URL (req.params).
 * 2. Extrae el título, estado y reunión del cuerpo de la solicitud (req.body).
 * 3. Intenta acceder a la colección "Solicitudes" de Firestore.
 * 4. Realiza una consulta para encontrar la solicitud correspondiente al usuario y título.
 * 5. Si se encuentra la solicitud, actualiza el estado y la reunión según los datos proporcionados.
 * 6. Si la actualización es exitosa, devuelve un mensaje de éxito.
 * 7. Si no se encuentra la solicitud, devuelve un error 404.
 * 8. Si ocurre un error durante la actualización, devuelve un error 500.
 * 9. Maneja posibles errores durante el proceso devolviendo un error 500.
 */
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


/**
 * Controlador para actualizar el feedback de una asistencia.
 * 1. Obtiene el tipo y ID de la asistencia desde los parámetros de la URL (req.params).
 * 2. Extrae la retroalimentación y el desempeño del cuerpo de la solicitud (req.body).
 * 3. Intenta acceder al documento correspondiente en la colección "AsistenciasAsignadas" o "Asistencias" de Firestore.
 * 4. Si el tipo es "asignada", busca en "AsistenciasAsignadas", de lo contrario, busca en "Asistencias".
 * 5. Si el documento existe, actualiza la retroalimentación y el desempeño.
 * 6. Si la actualización es exitosa, devuelve un mensaje de éxito.
 * 7. Si el documento no existe, devuelve un error 404.
 * 8. Si ocurre un error durante la actualización, devuelve un error 500.
 * 9. Maneja posibles errores durante el proceso devolviendo un error 500.
 * 
  */
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

/** 
 * Controlador para asignar un estudiante a una asistencia y eliminar su solicitud.
 * 1. Extrae los datos del cuerpo de la solicitud (req.body).
 * 2. Intenta acceder a la colección "Asistencias" de Firestore.
 * 3. Filtra las asistencias abiertas por título.
 * 4. Si no se encuentra ninguna asistencia abierta, devuelve un error 404.
 * 5. Si se encuentra una asistencia, crea un nuevo documento en "AsistenciasAsignadas" con los datos del estudiante.
 * 6. Busca y elimina las solicitudes del estudiante en la colección "Solicitudes".
 * 7. Si la asignación y eliminación son exitosas, devuelve un mensaje de éxito.
 * 8. Si ocurre un error durante el proceso, devuelve un error 500.
 * 9. Maneja posibles errores durante el proceso devolviendo un error 500.
 * 
 */
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

/** 
 * Controlador para establecer una reunión en una solicitud de postulación.
 * 1. Obtiene el ID de la solicitud desde los parámetros de la URL (req.params).
 * 2. Intenta acceder al documento correspondiente en la colección "Solicitudes" de Firestore.
 * 3. Actualiza el campo "reunion" a true en el documento de la solicitud.
 * 4. Si la actualización es exitosa, devuelve un mensaje de éxito.
 * 5. Si ocurre un error durante la actualización, devuelve un error 500.
 * 6. Maneja posibles errores durante el proceso devolviendo un error 500.
 * 
*/
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

/** 
 * Controlador para rechazar una postulación.
 * 1. Obtiene el ID de la postulación desde los parámetros de la URL (req.params).
 * 2. Intenta acceder al documento correspondiente en la colección "Solicitudes" de Firestore.
 * 3. Actualiza el campo "estado" a "Rechazado" en el documento de la postulación.
 * 4. Si la actualización es exitosa, devuelve un mensaje de éxito.
 * 5. Si ocurre un error durante la actualización, devuelve un error 500.
 * 6. Maneja posibles errores durante el proceso devolviendo un error 500.
 * 
 */
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

/** 
 * Controlador para actualizar el seguimiento de una asistencia asignada.
 * 1. Obtiene el ID de la asistencia desde los parámetros de la URL (req.params).
 * 2. Extrae los datos del cuerpo de la solicitud (req.body).
 * 3. Intenta acceder al documento correspondiente en la colección "AsistenciasAsignadas" de Firestore.
 * 4. Actualiza el documento con los nuevos datos proporcionados.
 * 5. Si la actualización es exitosa, devuelve un mensaje de éxito.
 * 6. Si ocurre un error durante la actualización, devuelve un error 500.
 * 7. Maneja posibles errores durante el proceso devolviendo un error 500.
 * 
*/
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