//---------------------------------------------------------------------------------------------------------------
// Archivo: login.routes.js
// Descripción general:
// Este archivo define las rutas de autenticación del sistema. Actualmente maneja el inicio de sesión (login).
//---------------------------------------------------------------------------------------------------------------

import { Router } from "express";            // Importación del módulo Router de Express
import { postLogin } from "../Controllers/login.Controller.js";  // Importación del controlador de login

const router = Router();  // Inicialización del router

//---------------------------------------------------------------------------------------------------------------
// Definición de rutas
//---------------------------------------------------------------------------------------------------------------

// Ruta POST para realizar login
router.post("/login", postLogin);  // Cuando se reciba un POST en /login, se ejecuta la función postLogin

//---------------------------------------------------------------------------------------------------------------
// Exportación del router para ser utilizado en el servidor principal
//---------------------------------------------------------------------------------------------------------------
export default router;
