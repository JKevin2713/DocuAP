import { transporter } from "../Services/emails.js";
import { db, app } from "../Services/fireBaseConnect.js";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";


//PARA USUARIOS
import { getAuth } from "firebase/auth";
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