// Se importan las funciones del controlador de profesores
import { Router } from "express";
import {
    getInfoProfesores, 
    updateInfoProfesores, 
    getAllCourses,
    getAllHistorial,
    getUserInfoByAsistencias,
    insertNewOferta,
    getAsistenciasByProfesor,
    getSolicitudesRelacionadasConAsistencias,
    updateOferta,
    deleteOferta,
    closeOferta,
    addDesempeno,
    searchCarreraByuserId,
    updatePostulacionAcciones,  
    updateAsistenciaFeedback,
    assignAndRemoveSolicitud,
    setSolicitudReunion,
    rechazarPostulacion,
    updateSeguimiento,
    } 
from "../Controllers/profesores.Controller.js";

// Se inicializa el router para definir las rutas
//---------------------------------------------------------------------------------------------------------------
const router = Router()

//---------------------------------------------------------------------------------------------------------------
// Rutas para la gestión de información de profesores y ofertas
// ---------------------------------------------------------------------------------------------------------------
// Obtener información de profesores
router.get('/infoProfesores/:id', getInfoProfesores); 
// Actualizar información de profesores
router.patch('/updateInfoProfesores/:id', updateInfoProfesores);
// Obtener cursos relacionados con el profesor
router.get('/getCursos/:id', getAllCourses);
// Obtener historial de asistencias del profesor
router.get('/getHistorial/:id', getAllHistorial);
// Obtener información de usuario relacionada con asistencias
router.get('/getUserInfoByAsistencias/:id', getUserInfoByAsistencias);
// Insertar nueva oferta
router.post('/insertNewOferta/:id', insertNewOferta);
// Obtener asistencias relacionadas con el profesor
router.get('/getAsistenciasByProfesor/:id', getAsistenciasByProfesor);
// Obtener solicitudes relacionadas con asistencias
router.get('/getSolicitudesRelacionadasConAsistencias/:id', getSolicitudesRelacionadasConAsistencias);
// Actualizar oferta
router.patch('/updateOferta/:id', updateOferta);
// Eliminar oferta
router.delete('/deleteOferta/:id', deleteOferta);
// Cerrar oferta
router.patch('/closeOferta/:id', closeOferta); 
// Agregar desempeño a la oferta
router.patch('/addDesempeno/:id', addDesempeno);
// Buscar carrera por ID de usuario
router.get('/searchCarreraByuserId/:id', searchCarreraByuserId);
// Actualizar acciones de postulación
router.patch('/updatePostulacionAcciones/:userId/', updatePostulacionAcciones);
// Actualizar feedback de asistencia
router.patch('/updateAsistenciaFeedback/:type/:id', updateAsistenciaFeedback);
// Actualizar seguimiento de asistencias
router.patch('/assignAndRemoveSolicitud', assignAndRemoveSolicitud);
// Actualizar solicitud de reunión
router.patch('/setSolicitudReunion/:id', setSolicitudReunion);
// Rechazar postulación
router.patch('/rechazarPostulacion/:id/', rechazarPostulacion);
// Actualizar seguimiento de solicitudes
router.patch('/updateSeguimiento/:id', updateSeguimiento);

//---------------------------------------------------------------------------------------------------------------
// Exportación del router para ser utilizado en el servidor principal
//---------------------------------------------------------------------------------------------------------------
export default router;
