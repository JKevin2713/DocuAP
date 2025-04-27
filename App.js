import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/Screens/Login/login'; // Asegúrate de que la ruta sea correcta
import RegisterScrreen from './src/Screens/Login/register'; // Asegúrate de que la ruta sea correcta

//Modulo 1, conexiones 
import HomePageEscuelaScreen  from './src/Screens/Module1/homePageEscuela';
import publiOfertaScreen from './src/Screens/Module1/publiOferta';
import listaOfertasScreen from './src/Screens/Module1/listaOfertas';
import crearOfertaScreen from './src/Screens/Module1/crearOferta';
import cursosEscuelaScreen from './src/Screens/Module1/cursosEscuela';  
import infoEscuelaScreen from './src/Screens/Module1/infoEscuela'; 
import actualizarPoliticasScreen from './src/Screens/Module1/actualizarPoliticas';
import adminPerfilEscuelaScreen from './src/Screens/Module1/adminPerfilEscuela'; // Asegúrate de que la ruta sea correcta
import historialAsistenciaScreen from './src/Screens/Module1/historialAsistencia';
import editarOfertaScreen from './src/Screens/Module1/editarOferta';
import historialPostulantesScreen from './src/Screens/Module1/historialPostulantes'; // Asegúrate de que la ruta sea correcta
import perfilEstudianteScreen from './src/Screens/Module1/perfilPostulante';
import asistenciaTotalHistScreen from './src/Screens/Module1/asistenciaTotalHist'; // Asegúrate de que la ruta sea correcta
import historialPagoAsisScreen from './src/Screens/Module1/historialPagoAsis'; // Asegúrate de que la ruta sea correcta
import crearPagoEstudianteScreen from './src/Screens/Module1/crearPagoEstudiante'; // Asegúrate de que la ruta sea correcta
import historialPagosScreen from './src/Screens/Module1/historialPagos'; // Asegúrate de que la ruta sea correcta
import perfilPostulanteScreen from './src/Screens/Module1/perfilPostulante'; // Asegúrate de que la ruta sea correcta

//Modulo de Profesores
import HomePageProfesores from './src/Screens/Profesores/homePageProfesores';
import RegistroEdicion from './src/Screens/Profesores/registroEdicion';
import GestionAsignaturas from './src/Screens/Profesores/gestionAsignaturas';
import EvaluacionRetroalimentacion from './src/Screens/Profesores/evaluacionRetroalimentacion'; 
import creacionOfertas from './src/Screens/Profesores/creacionOfertas';  
import EdicionOfertas from './src/Screens/Profesores/edicionOfertas';
import GestionPostulaciones from './src/Screens/Profesores/gestionPostulaciones';
import InfoEstudiante from './src/Screens/Profesores/infoEstudiante';
import SeguimientoEstudiantes from './src/Screens/Profesores/seguimientoEstudiantes'; 
import EvaluacionDesempeno from './src/Screens/Profesores/evaluacionDesempeno';
import EditarSeguimiento from './src/Screens/Profesores/editarSeguimiento'; 

//Modulo de Estudiantes
import HomePageEstudiantes from './src/Screens/Estudiantes/homePageEstudiantes';
import RegistroEdicionEstudiantes from './src/Screens/Estudiantes/registroEdicionEstudiantes';
import BusquedaOportunidades from './src/Screens/Estudiantes/busquedaApliOportunidades';
import FormularioAplicacion from './src/Screens/Estudiantes/formularioAplicacion';
import DetalleOportunidad from './src/Screens/Estudiantes/detallesOportunidad';
import SeguimientoSolicitudes from './src/Screens/Estudiantes/seguimientoSolicitudes';

//Modulo de Administradores 
import HomePageAdmin from './src/Screens/Administradores/homePageAdmin';
import GestionRolesUsuarios from './src/Screens/Administradores/gestionRolesUsuarios';
import CambioRol from './src/Screens/Administradores/cambioRol';
import CrearUsuario from './src/Screens/Administradores/crearUsuario';
import EditarUsuario from './src/Screens/Administradores/editarUsuario';
import MonitoreoActividades from './src/Screens/Administradores/monitoreoActividades';
import ValidacionOfertas from './src/Screens/Administradores/validacionOfertas';
import EditarOferta from './src/Screens/Administradores/editarOfertas';



const Stack = createStackNavigator();

export default function App() {
  // Return the main navigation container with stack navigator
  return (
    <NavigationContainer>

        <Stack.Navigator initialRouteName="login">

        {/* Login and Registration Screens */}
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="registroPage" component={RegisterScrreen} />

        {/* Module 1 Screens */}
        <Stack.Screen name="homePageEscuela" component={HomePageEscuelaScreen} />
        <Stack.Screen name="publiOferta" component={publiOfertaScreen} />
        <Stack.Screen name="listaOfertas" component={listaOfertasScreen} />
        <Stack.Screen name="crearOferta" component={crearOfertaScreen} />
        <Stack.Screen name="cursosEscuela" component={cursosEscuelaScreen} />
        <Stack.Screen name="infoEscuela" component={infoEscuelaScreen} />
        <Stack.Screen name="actualizarPoliticas" component={actualizarPoliticasScreen} />
        <Stack.Screen name="adminPerfilEscuela" component={adminPerfilEscuelaScreen} />
        <Stack.Screen name="historialAsistencia" component={historialAsistenciaScreen} />
        <Stack.Screen name="editarOferta" component={editarOfertaScreen} />
        <Stack.Screen name="historialPostulantes" component={historialPostulantesScreen} />
        <Stack.Screen name="perfilEstudiante" component={perfilEstudianteScreen} />
        <Stack.Screen name="asistenciaTotalHist" component={asistenciaTotalHistScreen} />
        <Stack.Screen name="historialPagoAsis" component={historialPagoAsisScreen} />
        <Stack.Screen name="crearPagoEstudiante" component={crearPagoEstudianteScreen} />
        <Stack.Screen name="historialPagos" component={historialPagosScreen} />
        <Stack.Screen name="perfilPostulante" component={perfilPostulanteScreen} />


        {/* Module Profesores*/}
        <Stack.Screen name="HomePageProfesores" component={HomePageProfesores} options={{title: "Inicio"}} />
        <Stack.Screen name="registroEdicion" component={RegistroEdicion} options={{title: "Registro y edición"}}/>
        <Stack.Screen name="gestionAsignaturas" component={GestionAsignaturas} options={{title: "Gestión de Asignaturas"}}/>
        <Stack.Screen name="evaluacionRetroalimentacion" component={EvaluacionRetroalimentacion} options={{title: "Evaluación"}}/>
        <Stack.Screen name="creacionOfertasProfesores" component={creacionOfertas} options={{title: "Crear Oferta"}}/>
        <Stack.Screen name="edicionOfertas" component={EdicionOfertas} options={{title: "Edición de Ofertas"}}/>
        <Stack.Screen name="gestionPostulaciones" component={GestionPostulaciones} options={{title: "Gestión de Postulaciones"}}/>
        <Stack.Screen name="InfoEstudiante" component={InfoEstudiante} options={{title: "Información del Estudiante"}}/>
        <Stack.Screen name="seguimientoEstudiantes" component={SeguimientoEstudiantes} options={{title: "Seguimiento de Estudiantes"}}/>
        <Stack.Screen name="evaluacionDesempeno" component={EvaluacionDesempeno} options={{title: "Evaluación de Desempeño"}}/>
        <Stack.Screen name="editarSeguimiento" component={EditarSeguimiento} options={{title: "Edición de Seguimiento"}}/>


        {/* Module Estudiantes*/}
        <Stack.Screen name="HomePageEstudiantes" component={HomePageEstudiantes} options={{title: "Inicio"}} />
        <Stack.Screen name="RegistroEdicionEstudiantes" component={RegistroEdicionEstudiantes} options={{title: "Registro y edición"}}/>
        <Stack.Screen name="busquedaApliOportunidades" component={BusquedaOportunidades} options={{title: "Busqueda y Aplicacion de Oportunidades"}}/>
        <Stack.Screen name="formularioAplicacion" component={FormularioAplicacion} options={{ title: "Aplicar a oportunidad" }} />
        <Stack.Screen name="detallesOportunidad" component={DetalleOportunidad} options={{ title: "Detalles Oportunidad" }} />
        <Stack.Screen name="seguimientoSolicitudes" component={SeguimientoSolicitudes} options={{ title: "Seguimiento Solicitudes" }} />


        {/* Module Admin*/}
        <Stack.Screen name="HomePageAdmin" component={HomePageAdmin} options={{title: "Inicio"}} />
        <Stack.Screen name="GestionRolesUsuarios" component={GestionRolesUsuarios} options={{title: "Gestion de usuarios y roles"}} />
        <Stack.Screen name="CambioRol" component={CambioRol} options={{title: "Cambio de roles"}} />
        <Stack.Screen name="CrearUsuario" component={CrearUsuario} options={{title: "Crear Usuario"}} />
        <Stack.Screen name="EditarUsuario" component={EditarUsuario} options={{title: "Editar Usuario"}} />
        <Stack.Screen name="MonitoreoActividades" component={MonitoreoActividades} options={{title: "Monitoreo de actividades"}} />
        <Stack.Screen name="ValidacionOfertas" component={ValidacionOfertas} options={{title: "Validacion ofertas "}} />
        <Stack.Screen name="EditarOferta" component={EditarOferta} options={{title: "Validacion ofertas "}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
