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

const router = Router()

router.get('/infoProfesores/:id', getInfoProfesores); 
router.patch('/updateInfoProfesores/:id', updateInfoProfesores);
router.get('/getCursos/:id', getAllCourses);
router.get('/getHistorial/:id', getAllHistorial);
router.get('/getUserInfoByAsistencias/:id', getUserInfoByAsistencias);
router.post('/insertNewOferta/:id', insertNewOferta);
router.get('/getAsistenciasByProfesor/:id', getAsistenciasByProfesor);
router.get('/getSolicitudesRelacionadasConAsistencias/:id', getSolicitudesRelacionadasConAsistencias);
router.patch('/updateOferta/:id', updateOferta);
router.delete('/deleteOferta/:id', deleteOferta);
router.patch('/closeOferta/:id', closeOferta); 
router.patch('/addDesempeno/:id', addDesempeno);
router.get('/searchCarreraByuserId/:id', searchCarreraByuserId);
router.patch('/updatePostulacionAcciones/:userId/', updatePostulacionAcciones);
router.patch('/updateAsistenciaFeedback/:type/:id', updateAsistenciaFeedback);
router.patch('/assignAndRemoveSolicitud', assignAndRemoveSolicitud);
router.patch('/setSolicitudReunion/:id', setSolicitudReunion);
router.patch('/rechazarPostulacion/:id/', rechazarPostulacion);
router.patch('/updateSeguimiento/:id', updateSeguimiento);


export default router;
