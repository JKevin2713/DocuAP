import { transporter } from "../Services/emails.js";
import { db, app } from "../Services/fireBaseConnect.js";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";


//PARA USUARIOS
import { getAuth } from "firebase/auth";

/**
 * Controlador para obtener usuarios y sus carreras
 * 1. Obtiene todos los documentos de la colección "Usuarios" en una sola operación
 * 2. Itera sobre cada usuario para:
 *    a. Determinar si es Profesor o Estudiante
 *    b. Buscar su carrera correspondiente dentro del mismo conjunto de usuarios
 *    c. Construir objeto con datos relevantes
 * 3. Maneja relaciones internas:
 *    - Usa documentos de tipo carrera almacenados en la misma colección Usuarios
 *    - Relaciona mediante ID referencia en campo 'carrera'
 * 4. Estructura respuesta uniforme:
 *    - Incluye todos los usuarios con datos básicos
 *    - Añade nombre de carrera para Profesores/Estudiantes
 */

export const obtenerUsuarios = async (req, res) => {
    const usuarios = [];

    try {
        // Obtenemos todos los usuarios una sola vez
        const usuariosSnapshot = await getDocs(collection(db, "Usuarios"));
        const todosLosUsuarios = usuariosSnapshot.docs;
        let nombreCarrera = "Carrera no encontrada";
        for (const usuarioDoc of todosLosUsuarios) {
            const datosUsuario = usuarioDoc.data();

            if (datosUsuario.tipoUsuario === "Profesor" || datosUsuario.tipoUsuario === "Estudiante") {
                // Buscamos la carrera correspondiente por ID
    

                const carreraRelacionada = todosLosUsuarios.find(
                    doc => doc.id === datosUsuario.carrera
                );

                if (carreraRelacionada) {
                    const datosCarrera = carreraRelacionada.data();
                    nombreCarrera = datosCarrera.carrera || nombreCarrera;
                }

            }
            usuarios.push({
                id: usuarioDoc.id,
                nombre: datosUsuario.nombre,
                rol: datosUsuario.tipoUsuario,
                correo: datosUsuario.correo,
                carrera: nombreCarrera,
                telefono: datosUsuario.telefono,
                sede: datosUsuario.sede
            });
        }

        return res.status(200).json({ datos: usuarios });

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
};

/**
 * Controlador para actualizar el rol de un usuario
 * 1. Recibe ID de usuario y nuevo rol desde el cuerpo de la solicitud
 * 2. Busca el documento del usuario en la colección "Usuarios"
 * 3. Actualiza el campo 'tipoUsuario' con el nuevo rol
 * 4. Maneja errores y envía respuesta adecuada
 * 
 * 
 */
export const actualizarRol = async (req, res) => {
    const { idUsuario, nuevoRol } = req.body; // Asegúrate de que el ID y el nuevo rol se envían en el cuerpo de la solicitud
    try {
        const usuarioRef = doc(db, "Usuarios", idUsuario);
        await updateDoc(usuarioRef, { tipoUsuario: nuevoRol });
        console.log("Rol actualizado correctamente");
        res.status(200).json({ message: "Rol actualizado correctamente" });
    } catch (error) {
        console.error("Error actualizando el rol:", error);
        res.status(500).json({ error: "Error al actualizar el rol" });
    }
}

/** 
 * Controlador para actualizar un usuario
 * 1. Recibe nombre de usuario, campo a actualizar y nuevo valor desde el cuerpo de la solicitud
 * 2. Busca el documento del usuario en la colección "Usuarios"
 * 3. Actualiza el campo especificado con el nuevo valor
 * 4. Maneja errores y envía respuesta adecuada
 *  
 * 
*/
export const actualizarUsuario = async (req, res) => { 
    const { nombreUsuario, campoSeleccionado, nuevoValor } = req.body;
    try {
        let idUsuario = '';
        const usuarioRef = await getDocs(collection(db, "Usuarios"));
        for(const doc of usuarioRef.docs) {
            if(doc.data().nombre === nombreUsuario) {
                idUsuario = doc.id;
                break;
            }
        }
        const docRef = doc(db, 'Usuarios', idUsuario); // 'Asistencias' es la colección, y ofertaId es el ID del documento

         // Crea un objeto con el campo a actualizar
        const data = {};
        data[campoSeleccionado] = nuevoValor;

        console.log("Campo a actualizar:", data);

        // Actualiza el documento con los nuevos valores
        await updateDoc(docRef, data);
        
        console.log("Documento actualizado correctamente");
        return res.status(200).json({ message: "Documento actualizado correctamente" });
    } 
    catch (error) {
        console.error("Error al actualizar el documento:", error);
        return res.status(400).json({ error: "Error al actualizar el documento" });
    }
}

/**
 * Controlador para eliminar un usuario
 * 1. Recibe ID de usuario desde la consulta de la solicitud
 * 2. Busca el documento del usuario en la colección "Usuarios"
 * 3. Elimina el documento
 * 4. Maneja errores y envía respuesta adecuada
 * 
 */
export const eliminarUsuario = async (req, res) => {
    const id = req.query.id; // Asegúrate de que el ID se envía en el cuerpo de la solicitud
    try {
        await deleteDoc(doc(db, "Usuarios", id));
        console.log("Documento eliminado correctamente");
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error eliminando el documento:", error);
    }
};

/** 
 * Controlador para obtener carreras
 * 1. Obtiene todos los documentos de la colección "Usuarios"
 * 2. Filtra los documentos para encontrar aquellos que son de tipo "Escuela" y tienen una carrera asignada
 * 3. Construye una lista de carreras únicas usando un Set
 * 4. Envía la lista de carreras como respuesta
 * 
*/
export const obtenerCarreras = async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, "Usuarios"));
      const carrerasList = []; // Usamos un array en lugar de un Set
    
      snapshot.forEach(doc => {
        const data = doc.data();
        // Verificamos que el tipo de usuario sea "Escuela" y que tenga una carrera asignada
        if (data.tipoUsuario === "Escuela" && data.carrera) {
          carrerasList.push({ id: doc.id, carrera: data.carrera }); // Añadimos el objeto con id y carrera
        }
      });
    
      return res.status(200).json({ carreras: carrerasList });
    } catch (error) {
      console.error("Error al extraer carreras:", error);
      return res.status(500).json({ error: "Error al extraer las carreras" });
    }
  };


//PARA OFERTAS 
/**
 * Controlador para obtener ofertas
 * 1. Obtiene todos los documentos de la colección "Asistencias"
 * 2. Itera sobre cada documento para construir una lista de ofertas
 * 3. Cada oferta incluye ID, nombre, tipo, estado, cantidad de estudiantes y horas
 * 4. Envía la lista de ofertas como respuesta
 *  
 *  
 */
export const obtenerOfertas = async (req, res) => {
    try {
        const Asistenciassnapshot = await getDocs(collection(db, "Asistencias"));
        const ofertasList = []; // Usamos un array en lugar de un Set

        for(const doc of Asistenciassnapshot.docs) {
            const data = doc.data();
            ofertasList.push({
                id: doc.id,
                nombre: data.tituloPrograma,
                tipo: data.tipo,
                estado: data.estado,
                estudiantes: data.cantidadVacantes,
                horas: data.totalHoras
            });
        }
        return res.status(200).json({ ofertas: ofertasList });
    } catch (error) {
        console.error("Error al extraer ofertas:", error);
        return res.status(500).json({ error: "Error al extraer las ofertas" });
    }
}

/**
 * Controlador para aceptar una oferta
 * 1. Recibe ID de oferta desde el cuerpo de la solicitud
 * 2. Busca el documento de la oferta en la colección "Asistencias"
 * 3. Actualiza el campo 'estado' a "Abierta"
 * 4. Maneja errores y envía respuesta adecuada
 *  
 *  
 */
export const aceptarOferta = async (req, res) => {
    const { id } = req.body; // Asegúrate de que el ID se envía en el cuerpo de la solicitud
    console.log("ID de la oferta a aceptar:", id);
    try {
        const ofertaRef = doc(db, "Asistencias", id);
        await updateDoc(ofertaRef, { estado: "Abierta" });

        console.log("asistencia aceptada correctamente");
        res.status(200).json({ message: "asistencia aceptada correctamente" });
    } catch (error) {
        console.error("Error aceptada la asistencia:", error);
        res.status(500).json({ error: "Error al aceptada la asistencia" });
    }
}

/**
 * Controlador para eliminar una oferta
 * 1. Recibe ID de oferta desde la consulta de la solicitud
 * 2. Busca el documento de la oferta en la colección "Asistencias"
 * 3. Actualiza el campo 'estado' a "Cerrado"
 * 4. Maneja errores y envía respuesta adecuada
 * 
 *  
 */
export const eliminarOferta = async (req, res) => {
    const id = req.query.id;// Asegúrate de que el ID se envía en el cuerpo de la solicitud
    try {
        const ofertaRef = doc(db, "Asistencias", id);
        await updateDoc(ofertaRef, { estado: "Cerrado" });

        console.log("asistencia cerrado correctamente");
        res.status(200).json({ message: "asistencia cerrada correctamente" });
    } catch (error) {
        console.error("Error cerradar la asistencia:", error);
        res.status(500).json({ error: "Error al cerradar la asistencia" });
    }
}

/** 
 * Controlador para actualizar una oferta
 * 1. Recibe nombre de usuario, campo a actualizar y nuevo valor desde el cuerpo de la solicitud
 * 2. Busca el documento de la oferta en la colección "Asistencias"
 * 3. Actualiza el campo especificado con el nuevo valor
 * 4. Maneja errores y envía respuesta adecuada
 * 
 */
export const actualizarOferta = async (req, res) => {
    const { nombreUsuario, campoSeleccionado, nuevoValor } = req.body;
    try {
        let idAsistencia = '';
        const asistenciasRef = await getDocs(collection(db, "Asistencias"));
        for(const doc of asistenciasRef.docs) {
            if(doc.data().tituloPrograma === nombreUsuario) {
                idAsistencia = doc.id;
                break;
            }
        }
        const docRef = doc(db, 'Asistencias', idAsistencia); 


        const data = {};
        data[campoSeleccionado] = nuevoValor;

        console.log("Campo a actualizar:", data);

        // Actualiza el documento con los nuevos valores
        await updateDoc(docRef, data);
        
        console.log("Documento actualizado correctamente");
        return res.status(200).json({ message: "Documento actualizado correctamente" });
    } 
    catch (error) {
        console.error("Error al actualizar el documento:", error);
        return res.status(400).json({ error: "Error al actualizar el documento" });
    }
}

//PARA MONITOREO DE ASISTENCIAS

/**
 * Controlador para monitorear asistencias
 * 1. Obtiene todos los documentos de la colección "Asistencias"
 * 2. Itera sobre cada documento para construir una lista de asistencias
 * 3. Cada asistencia incluye ID, nombre del programa, semestre, responsable y estado
 * 4. Envía la lista de asistencias como respuesta
 *
 */
export const monitoreoAsistencia = async (req, res) => {

    try{
        const asistenciasSnapshot = await getDocs(collection(db, "Asistencias"));
        const usuariosSnapshot = await getDocs(collection(db, "Usuarios"));
        const asistenciasList = []; // Usamos un array en lugar de un Set
        let nombreCarrera = '';
        for(const doc of asistenciasSnapshot.docs) {
            const data = doc.data();

            for(const doc1 of usuariosSnapshot.docs) {
                if(doc1.id === data.personaACargo) {
                    nombreCarrera = doc1.data().nombre;
                }
            }
            asistenciasList.push({
                id: doc.id,
                asistencia: data.tituloPrograma,
                periodo: data.semestre,
                responsable: nombreCarrera,
                estado: data.estado,
            });
        }
        return res.status(200).json({ asistencias: asistenciasList });
    }
    catch (error) {
        console.error("Error al extraer asistencias:", error);
        return res.status(500).json({ error: "Error al extraer las asistencias" });
    }
}