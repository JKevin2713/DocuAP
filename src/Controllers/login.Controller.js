//---------------------------------------------------------------------------------------------------------------
// Archivo: postLogin.js
// Descripción general: Este archivo contiene la función principal para gestionar el inicio de sesión de usuarios.
// Se valida correo y contraseña contra la base de datos (Firestore), se identifica el rol del usuario,
// se envía un correo de notificación y se retorna la respuesta HTTP correspondiente.
//---------------------------------------------------------------------------------------------------------------

import { transporter } from "../Services/emails.js";
import { db, app } from "../Services/fireBaseConnect.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";

//---------------------------------------------------------------------------------------------------------------
// Función postLogin - Maneja el inicio de sesión de un usuario, valida credenciales y envía correo de notificación
//---------------------------------------------------------------------------------------------------------------
export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Solicitud recibida en login", email);

  // Validar las credenciales recibidas
  const credenciales = await validarCredenciales(email.toLowerCase(), password);
  let id = credenciales.id;
  let tipo = credenciales.tipoUsuario;

  console.log("Tipo de usuario:", tipo);

  //---------------------------------------------------------------------------------------------------------------
  // Validación del tipo de usuario y respuesta de login correspondiente
  //---------------------------------------------------------------------------------------------------------------

  if(tipo === "Estudiante"){
    enviarCorreo(email) // Enviar notificación de inicio de sesión
    return res.status(200).json({
      message: "Login exitoso",
      status: "success",
      rol: "estudiante",
      id: id
    });
  }
  else if(tipo === "Profesor"){
    enviarCorreo(email)
    return res.status(200).json({
      message: "Login exitoso",
      status: "success",
      rol: "profesor",
      id: id
    });
  } 
  else if(tipo === "Administrador"){
    enviarCorreo(email)
    return res.status(200).json({
      message: "Login exitoso",
      status: "success",
      rol: "admin",
      id: id
    });
  } 
  else if(tipo === "Escuela" || tipo === "Departamento"){
    enviarCorreo(email)
    return res.status(200).json({
      message: "Login exitoso",
      status: "success",
      rol: "escuela",
      id: id
    });
  }
  else if(tipo === 400){
    enviarCorreo(email) // A pesar de error, se envía notificación
    return res.status(401).json({
      message: "Credenciales inválidas",
      status: "error"
    });
  }
  else if(tipo === 401){
    return res.status(402).json({
      message: "Error al validar credenciale",
      status: "error"
    });
  }

  // Si no se reconoce ningún tipo, se responde con error general
  return res.status(401).json({
    message: "Credenciales inválidas",
    status: "error"
  });
};

//---------------------------------------------------------------------------------------------------------------
// Función enviarCorreo - Envía un correo de notificación al usuario cuando inicia sesión
//---------------------------------------------------------------------------------------------------------------
const enviarCorreo = async (email) => {
    let nombre = "";
    const querySnapshot = await getDocs(collection(db, "Usuarios")); // Obtener todos los usuarios de Firestore

    // Buscar el nombre del usuario por su correo
    for (const doc of querySnapshot.docs) {
      const datos = doc.data();
      if (datos.correo.toLowerCase() === email.toLowerCase()) {
        nombre = datos.nombre; // Guardar el nombre encontrado
      }
    }

    console.log("Nombre del usuario:", nombre);

    // Enviar correo utilizando transporter configurado
    await transporter.sendMail({
      from: 'Inicio seccion <salascordero2003@gmail.com>', // Remitente del correo
      to: email, // Destinatario
      subject: "Inicio seccion",
      text: "Te informamos que tu sesión ha sido iniciada.",
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #007bff;">¡Bienvenido(a) al sistema!</h1>
            <p>Hola, <strong>${nombre}</strong>,</p>
            <p>Nos alegra que formes parte de nuestra plataforma.</p>
            <p>A partir de ahora podrás acceder a todas las funcionalidades que hemos preparado para ti.</p>
            <p>Si tienes alguna duda o necesitas ayuda, no dudes en contactarnos.</p>
            <br>
            <p>¡Te deseamos mucho éxito!</p>
            <p>— El equipo de ApProyect</p>
          </div>
        `
    });
}

//---------------------------------------------------------------------------------------------------------------
// Función validarCredenciales - Verifica que el correo y contraseña ingresados correspondan a un usuario en la base
//---------------------------------------------------------------------------------------------------------------
const validarCredenciales = async (emailIngresado, contrasenaIngresada) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Usuarios")); // Obtener todos los usuarios

    // Comparar cada usuario con las credenciales ingresadas
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (
        data.correo?.toLowerCase() === emailIngresado.toLowerCase() &&
        data.contrasena === contrasenaIngresada
      ) {
        console.log("Usuario autenticado:", data);
        // Retornar tipo de usuario e ID si se autenticó
        return {
          tipoUsuario: data.tipoUsuario,
          id: doc.id
        };
      }
    }

    console.log("Correo o contraseña incorrectos.");
    return 400; // Retornar 400 si no se encontró coincidencia

  } catch (error) {
    console.error("Error al validar credenciales:", error);
    return 401; // Retornar 401 si ocurre un error en el proceso
  }
};
