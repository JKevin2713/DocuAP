// Se importan desde el controlador las funciones necesarias para la gestión de usuarios y ofertas
import {Router} from "express"
import { obtenerUsuarios,
        actualizarRol,
        actualizarUsuario, 
        eliminarUsuario,
        obtenerCarreras,
        obtenerOfertas,
        aceptarOferta,
        eliminarOferta,
        actualizarOferta,
        monitoreoAsistencia
        } from "../Controllers/admin.Controller.js"

// se define el router para las rutas de administrador
//---------------------------------------------------------------------------------------------------------------
const router = Router()

//---------------------------------------------------------------------------------------------------------------
// Rutas para la gestión de usuarios y ofertas
//---------------------------------------------------------------------------------------------------------------
// Obtener datos de usuarios
router.get("/admin/obtenerDatosUsuarios", obtenerUsuarios);
// Actualizar rol de usuario
router.put("/admin/ActualizarRol", actualizarRol)
// Actualizar datos de usuario
router.put("/admin/ActualizarUsuario", actualizarUsuario)
// Eliminar usuario
router.delete("/admin/EliminarUsuario", eliminarUsuario);
// Obtener lista de carreras
router.get('/admin/carreras', obtenerCarreras);
// Obtener lista de ofertas
router.get('/admin/Ofertas', obtenerOfertas); 
// Aceptar oferta
router.put('/admin/aceptarOferta', aceptarOferta); 
// Eliminar oferta
router.delete('/admin/eliminarOferta', eliminarOferta); 
// Actualizar oferta
router.put('/admin/actualizarOferta', actualizarOferta);
// Monitoreo de asistencia
router.get('/admin/monitoreoAsistencia', monitoreoAsistencia);
//---------------------------------------------------------------------------------------------------------------
// Exportación del router para ser utilizado en el servidor principal
// ---------------------------------------------------------------------------------------------------------------
export default router;