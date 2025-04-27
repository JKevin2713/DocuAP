//---------------------------------------------------------------------------------------------------------------
// Archivo: modulo1.routes.js
// Descripción general:
// Este archivo define todas las rutas relacionadas con la gestión de Escuelas, Departamentos y sus procesos.
// Incluye rutas para perfiles, cursos, asistencias, ofertas académicas, postulaciones, pagos y beneficiarios.
//---------------------------------------------------------------------------------------------------------------

import { Router } from "express";
import { 
    informacionAdmin,
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
} from "../Controllers/modulo1.Controller.js"; // Importación de todos los controladores necesarios

const router = Router(); // Inicialización del router

//---------------------------------------------------------------------------------------------------------------
// Rutas para gestión de perfil de Escuela y Administradores
//---------------------------------------------------------------------------------------------------------------

// Obtener información del administrador
router.get("/escuelas/infoEscuelaAdmin", informacionAdmin);

// Actualizar información del administrador
router.put("/escuelas/actualizarInfoAdmin", actualizarInfoAdmin);

// Obtener información de una escuela
router.get("/escuelas/infoEscuela", informacionEscuela);

// Actualizar información de una escuela
router.put("/escuelas/actualizarInfoEscuela", actualizarInfoEscuela);

//---------------------------------------------------------------------------------------------------------------
// Rutas para gestión de cursos de la Escuela
//---------------------------------------------------------------------------------------------------------------

// Obtener cursos asociados a la escuela
router.get("/escuelas/cursosEscuela", informacionCursosEscuela);

//---------------------------------------------------------------------------------------------------------------
// Rutas para historial de asistencias
//---------------------------------------------------------------------------------------------------------------

// Obtener historial de asistencias asociadas a la escuela
router.get("/escuelas/historialAsistencias", historialAsistencias);

//---------------------------------------------------------------------------------------------------------------
// Rutas para gestión de ofertas académicas
//---------------------------------------------------------------------------------------------------------------

// Obtener historial de ofertas activas
router.get("/escuelas/historialOfertasActivas", informacionOfertas);

// Obtener profesores asociados a la escuela
router.get("/escuelas/profesoresEscuela", informacionProfesoresCarrera);

// Publicar una nueva oferta académica
router.post("/escuelas/publiOferta", publicarOfertas);

// Actualizar información de una oferta publicada
router.put("/escuelas/actualizarOferta", actualizarInfoOferta);

// Obtener detalles de una oferta específica
router.get("/escuelas/informacionOferta", InformacionOferta);

// Obtener historial de todas las ofertas publicadas
router.get("/escuelas/historialOfertas", historialOfertas);

//---------------------------------------------------------------------------------------------------------------
// Rutas para gestión de postulaciones
//---------------------------------------------------------------------------------------------------------------

// Obtener historial de postulantes a ofertas
router.get("/escuelas/historialPostulantes", informacionPostulantes);

// Obtener perfil detallado de estudiantes postulantes
router.get("/escuelas/perfilEstudiantes", informacionEstudiante);

//---------------------------------------------------------------------------------------------------------------
// Rutas para gestión de pagos y asistencias activos
//---------------------------------------------------------------------------------------------------------------

// Obtener historial de asistencias activas y pagos relacionados
router.get("/escuelas/historialPagoAsisActivos", informacionPagoAsisActivos);

// Obtener datos para crear una nueva oferta académica con pago
router.get("/escuelas/obtenerDatosCrearOferta", obtenerDatosCrearOferta);

// Crear un nuevo pago de oferta académica
router.post("/escuelas/crearPagoOferta", crearPagoOferta);

// Obtener lista de estudiantes postulados a una oferta
router.get("/escuelas/estudiantesPostulados", estudiantesPostulados);

//---------------------------------------------------------------------------------------------------------------
// Rutas para historial de beneficiarios
//---------------------------------------------------------------------------------------------------------------

// Obtener historial de estudiantes beneficiarios en asistencias
router.get("/escuelas/historialBeneficiarios", historialBeneficiarios);

//---------------------------------------------------------------------------------------------------------------
// Exportación del router para ser utilizado en el servidor principal
//---------------------------------------------------------------------------------------------------------------
export default router;
