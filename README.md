# Aplicación Móvil – Gestión de Asistencias, Tutorías y Proyectos  
**Instituto Tecnológico de Costa Rica (TEC)**

---

## Ejecución de la Aplicación

### 1. Usando Expo (modo desarrollo)

1. Abrir el archivo: `src/Services/url.js`

2. Reemplazar la constante `URL` con tu dirección IP local (IPv4).  

   const URL = "http://192.168.X.X";
   export default URL;
   
3. Para obtener la IP local:
   - Abrir la terminal (Windows)
   - Ejecutar el comando: `ipconfig`
   - Copiar la dirección del campo **IPv4 Address**

4. En una terminal nueva, iniciar el servidor backend (No cerrar esta terminal): 

   npm run dev
   
5. En otra terminal, iniciar la aplicación móvil:
   
   npm start
   
6. Se abrirá Expo Developer Tools en el navegador.

7. Desde tu celular, escanear el código QR usando la aplicación **Expo Go**.

8. La app se cargará automáticamente en el dispositivo.

---

### 2. Usando el archivo `.apk` (modo producción)

1. Descargar o transferir el archivo `.apk` generado mediante `eas build`.

2. En tu celular Android:
   - Ir a **Configuración > Seguridad > Fuentes desconocidas**
   - Habilitar la opción para instalar desde fuentes externas

3. Abrir el archivo `.apk` y completar la instalación.

4. Buscar el ícono de la app en el menú del teléfono y abrirla.

5. Asegurarse de que el celular esté conectado a la misma red Wi-Fi que el backend.

---

### Requisitos de Conexión para el `.apk`

- **Backend:** debe estar activo en una IP accesible desde el celular.
- **Archivo `url.js`:** debe tener la dirección IP correcta, por ejemplo: `http://192.168.1.5:3000`
- **Red Wi-Fi:** el dispositivo móvil y el servidor deben estar en la misma red.

---

## Introducción

Esta aplicación está diseñada para facilitar la gestión y seguimiento de asistencias, tutorías y proyectos entre estudiantes, profesores, escuelas y administradores del TEC.  
El sistema está compuesto por varios módulos según el rol del usuario.

---

## Tipos de Usuario y Correos Institucionales

Cada usuario debe iniciar sesión usando su correo institucional correspondiente. El sistema identifica automáticamente el rol a partir del dominio del correo.

- Estudiantes: `@estudiantec.cr`  
  Ejemplo: `juanperez@estudiantec.cr`

- Profesores: `@itcr.ac.cr`  
  Ejemplo: `mariaruiz@itcr.ac.cr`

- Escuelas/Departamentos: `@tec.ac.cr`  
  Ejemplo: `electro@tec.ac.cr`

- Administradores: `@tec.ac.cr`  
  Ejemplo: `admin@tec.ac.cr`

---

## Módulos y Funcionalidades

### Módulo Escuelas / Departamentos

- **Perfil institucional:** registro y edición del perfil con facultad, contacto, programas académicos y áreas de especialización.  
- **Políticas internas:** configuración de requisitos como promedio mínimo, cursos requeridos, horas máximas y otros criterios.  
- **Publicación de oportunidades:** creación de ofertas académicas con descripción, requisitos, fechas, profesores y beneficios.  
- **Gestión de postulaciones:** visualización con filtros, historial, acciones (aprobar, rechazar, solicitar información) y notificaciones.  
- **Gestión de beneficios económicos:** asignación de exoneraciones y pagos; reportes por estudiante y semestre.

---

### Módulo Profesores

- **Gestión de perfil:** edición de datos, materias asignadas, historial de asistencias y registro institucional.  
- **Publicación de ofertas:** creación de tutorías y proyectos con formulario completo, edición, cierre anticipado y notificaciones.  
- **Revisión de postulaciones:** listado con filtros, revisión de documentos, entrevistas, acciones con comentarios.  
- **Seguimiento de estudiantes:** registro de asistencia, tareas, desempeño, notas y feedback cualitativo.

---

### Módulo Estudiantes

- **Registro académico:** creación de perfil con correo institucional, carrera, nivel, documentos y promedio.  
- **Búsqueda de oportunidades:** filtros por carrera, profesor, palabra clave, horarios y promedio.  
- **Postulación a ofertas:** aplicación directa, carga de archivos y seguimiento del estado de la solicitud.  
- **Seguimiento de actividades:** historial, monitoreo de horas trabajadas, evaluaciones y descarga de certificados.

---

### Módulo Administradores

- **Gestión de usuarios y roles:** creación, edición y eliminación de cuentas; asignación de roles y permisos.  
- **Moderación de contenido:** validación, edición o eliminación de publicaciones; supervisión general de la plataforma.

---

## Requisitos Técnicos

- Tener Node.js instalado (versión recomendada: 18+)
- Instalar la app Expo Go en el dispositivo móvil (Android o iOS)
- Estar conectado a una red Wi-Fi compartida (PC y celular deben estar en la misma red)

---

## Recomendaciones Finales

- Probar cada rol utilizando correos válidos según el dominio correspondiente.
- Verificar que el backend esté activo y accesible desde el celular.
- Asegurarse de que Firestore tenga datos de prueba en las colecciones principales (`Usuarios`, `Ofertas`, etc.).
- Validar la visualización de la app en diferentes tamaños de pantalla.
- Si se comparte la app en `.apk`, considerar subir el backend a un servicio público como Render o Firebase Functions para acceso desde cualquier red.

