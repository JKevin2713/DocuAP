import { transporter } from "../Services/emails.js";
import { db, app } from "../Services/fireBaseConnect.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Solicitud recibida en login", email);

const credenciales = await validarCredenciales(email.toLowerCase(), password);
let id = credenciales.id;
let tipo = credenciales.tipoUsuario;

console.log("Tipo de usuario:", tipo);
  if(tipo === "Estudiante"){
    enviarCorreo(email)
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
    enviarCorreo(email)
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

  return res.status(401).json({
    message: "Credenciales inválidas",
    status: "error"
  });
};

const enviarCorreo = async (email) => {
    let nombre = "";
    const querySnapshot = await getDocs(collection(db, "Usuarios"));

    for (const doc of querySnapshot.docs) {
      const datos = doc.data();
      if (datos.correo.toLowerCase() === email.toLowerCase()) {
        nombre = datos.nombre;
      }
    }

    console.log("Nombre del usuario:", nombre);
    
    await transporter.sendMail({
      from: 'Inicio seccion <salascordero2003@gmail.com>',
      to: email,
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



const validarCredenciales = async (emailIngresado, contrasenaIngresada) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Usuarios"));

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (
        data.correo?.toLowerCase() === emailIngresado.toLowerCase() &&
        data.contrasena === contrasenaIngresada
      ) {
        console.log("Usuario autenticado:", data);
        return {
          tipoUsuario: data.tipoUsuario,
          id: doc.id
        }; // ahora sí retorna correctamente
      }
    }

    console.log("Correo o contraseña incorrectos.");
    return 400;

  } catch (error) {
    console.error("Error al validar credenciales:", error);
    return 401;
  }
};




