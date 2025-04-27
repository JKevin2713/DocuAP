import {Router} from "express"
import {informacionAdmin,
        actualizarInfoAdmin,
        informacionEscuela, 
        actualizarInfoEscuela, 
        informacionCursosEscuela,
        historialAsistencias,
        informacionOfertas,
        informacionProfesoresCarrera,
        publicarOfertas,
        actualizarInfoOferta,
        InformacionOferta,
        historialOfertas,
        informacionPostulantes,
        informacionEstudiante,
        informacionPagoAsisActivos,
        obtenerDatosCrearOferta,
        crearPagoOferta,
        estudiantesPostulados,
        historialBeneficiarios
} 
from "../Controllers/modulo1.Controller.js"

const router = Router()

router.get("/escuelas/infoEscuelaAdmin", informacionAdmin);
router.put("/escuelas/actualizarInfoAdmin", actualizarInfoAdmin);

router.get("/escuelas/infoEscuela", informacionEscuela);
router.put("/escuelas/actualizarInfoEscuela", actualizarInfoEscuela); // Cambia el controlador según lo que necesites hacer

router.get("/escuelas/cursosEscuela", informacionCursosEscuela);

router.get("/escuelas/historialAsistencias", historialAsistencias)

router.get("/escuelas/historialOfertasActivas", informacionOfertas)
router.get("/escuelas/profesoresEscuela", informacionProfesoresCarrera) // Cambia el controlador según lo que necesites hacer
router.post("/escuelas/publiOferta", publicarOfertas)
router.put("/escuelas/actualizarOferta", actualizarInfoOferta) // Cambia el controlador según lo que necesites hacer
router.get("/escuelas/informacionOferta", InformacionOferta) // Cambia el controlador según lo que necesites hacer

router.get("/escuelas/historialOfertas", historialOfertas)

router.get("/escuelas/historialPostulantes", informacionPostulantes)
router.get("/escuelas/perfilEstudiantes", informacionEstudiante)

router.get("/escuelas/historialPagoAsisActivos", informacionPagoAsisActivos)

router.get("/escuelas/obtenerDatosCrearOferta", obtenerDatosCrearOferta)
router.post("/escuelas/crearPagoOferta", crearPagoOferta)
router.get("/escuelas/estudiantesPostulados", estudiantesPostulados)

router.get("/escuelas/historialBeneficiarios", historialBeneficiarios)

export default router;