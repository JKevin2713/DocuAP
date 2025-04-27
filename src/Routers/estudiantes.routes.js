//---------------------------------------------------------------------------------------------------------------
// Archivo: estudiantes.routes.js
// Descripción general:
// Este archivo define todas las rutas relacionadas con los estudiantes.
// Incluye gestión de perfil académico, visualización de oportunidades, registro de solicitudes y seguimiento.
//---------------------------------------------------------------------------------------------------------------

import { Router } from "express";
import { 
    informacionEstudiante,
    registrarPerfilAcademico,
    obtenerOportunidades,
    obtenerCarreras,
    registrarSolicitud,
    seguimientoSolicitudes
} from "../Controllers/estudiantes.Controller.js"; // Importación de controladores relacionados a estudiantes

const router = Router(); // Inicialización del router

//---------------------------------------------------------------------------------------------------------------
// Rutas para gestión de perfil del estudiante
//---------------------------------------------------------------------------------------------------------------

// Obtener información del perfil del estudiante
router.get("/estudiantes/infoEstudiantes", informacionEstudiante);

// Registrar o actualizar el perfil académico del estudiante
router.post("/estudiantes/registrarPerfil", registrarPerfilAcademico);

//---------------------------------------------------------------------------------------------------------------
// Rutas para oportunidades y solicitudes
//---------------------------------------------------------------------------------------------------------------

// Obtener lista de oportunidades disponibles (asistencias, tutorías, proyectos)
router.get("/asistencias/oportunidades", obtenerOportunidades);

// Registrar una nueva solicitud para una oportunidad
router.post("/solicitudes/registrar", registrarSolicitud);

//---------------------------------------------------------------------------------------------------------------
// Rutas para apoyo en matrícula y seguimiento
//---------------------------------------------------------------------------------------------------------------

// Obtener lista de carreras disponibles
router.get("/estudiantes/carreras", obtenerCarreras);

// Obtener el seguimiento de solicitudes realizadas
router.get("/solicitudes/seguimiento", seguimientoSolicitudes);

//---------------------------------------------------------------------------------------------------------------
// Exportación del router para ser utilizado en el servidor principal
//---------------------------------------------------------------------------------------------------------------
export default router;
