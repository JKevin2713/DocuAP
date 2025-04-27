import { View, Text, ScrollView, Image, SafeAreaView, TouchableOpacity} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { styles } from '../../Style/Module1/homePageEscuela';
import { useRoute } from '@react-navigation/native';


export default function HomePageScreen() {
  const navigation = useNavigation()
  const route = useRoute();
  const { userId } = route.params;


  console.log("User ID:", userId); // Log the userId to verify it's being passed correctly

  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/LogoTec.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.sectionTitle}>Perfiles de Escuela/Departamento</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("adminPerfilEscuela", { userId: userId })}>
            <Text style={styles.menuItemText}>Registro y edición de perfil institucional</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("infoEscuela", { userId: userId })}>
            <Text style={styles.menuItemText}>Gestión de información de contacto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("cursosEscuela", { userId: userId })}>
            <Text style={styles.menuItemText}>Áreas Académicas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("historialAsistencia", { userId: userId })}>
            <Text style={styles.menuItemText}>Historial de asistencias/tutorías </Text>
          </TouchableOpacity>
        </View>


        <Text style={styles.sectionTitle}>Publicación de Ofertas de Asistencias, Tutorías y Proyectos</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("publiOferta", { userId: userId })}>
            <Text style={styles.menuItemText}>Sistema de publicación de ofertas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("listaOfertas", { userId: userId })}>
            <Text style={styles.menuItemText}>Historial de cambios en la oferta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("historialPostulantes", { userId: userId })}>
            <Text style={styles.menuItemText}>Asignación de Estudiantes a Tutorías</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Gestión de Postulaciones de Estudiantes</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("asistenciaTotalHist", { userId: userId })}>
            <Text style={styles.menuItemText}>Visualización de postulantes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("crearPagoEstudiante", { userId: userId })}>
            <Text style={styles.menuItemText}>Gestion de postulaciones</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Gestión de Proyectos</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("historialPagoAsis", { userId: userId })}>
            <Text style={styles.menuItemText}>Pagos actuales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("historialPagos", { userId: userId })}>
            <Text style={styles.menuItemText}>Historial y reportes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Cursos activos</Text>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statDescription}>Ver todos los estudiantes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Estudiantes participantes</Text>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statDescription}>Revisar estudiantes</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Número de profesores</Text>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statDescription}>Ver todos los profesores</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Desafíos pendientes</Text>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statDescription}>Administrar desafíos</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
