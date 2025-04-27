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

const router = Router()

router.get("/admin/obtenerDatosUsuarios", obtenerUsuarios);
router.put("/admin/ActualizarRol", actualizarRol)
router.put("/admin/ActualizarUsuario", actualizarUsuario)
router.delete("/admin/EliminarUsuario", eliminarUsuario);
router.get('/admin/carreras', obtenerCarreras);

router.get('/admin/Ofertas', obtenerOfertas); 
router.put('/admin/aceptarOferta', aceptarOferta); 
router.delete('/admin/eliminarOferta', eliminarOferta); 
router.put('/admin/actualizarOferta', actualizarOferta);

router.get('/admin/monitoreoAsistencia', monitoreoAsistencia);



export default router;