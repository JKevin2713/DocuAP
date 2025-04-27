import {Router} from "express"
import {informacionEstudiante,registrarPerfilAcademico,obtenerOportunidades,obtenerCarreras,registrarSolicitud,seguimientoSolicitudes} 
from "../Controllers/estudiantes.Controller.js"

const router = Router()

router.get("/estudiantes/infoEstudiantes", informacionEstudiante);
router.post("/estudiantes/registrarPerfil", registrarPerfilAcademico);
router.get('/asistencias/oportunidades', obtenerOportunidades); // nueva ruta
router.post("/solicitudes/registrar", registrarSolicitud);
router.get('/estudiantes/carreras', obtenerCarreras);
router.get('/solicitudes/seguimiento', seguimientoSolicitudes);


export default router;
