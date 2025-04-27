// Importaciones necesarias
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { styles } from "../../Style/Profesores/gestionAsignaturas";
import axios from "axios";
import URL from "../../Services/url"; 
import { useNavigation, useRoute } from '@react-navigation/native';

//---------------------------------------------------------------------------------------------------------------
// Componente HistorialCard - Tarjeta para mostrar el historial de asignaciones
//---------------------------------------------------------------------------------------------------------------
// Este componente recibe un objeto de historial y lo muestra en una tarjeta estilizada.
const HistorialCard = ({ item }) => {
  const safeFormatDate = (timestamp) => {
    try {
      if (!timestamp) return "";
      if (typeof timestamp === "object" && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toISOString().split("T")[0];
      }
      return typeof timestamp === "string" ? timestamp : "";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha inválida";
    }
  };

  // Formatear las fechas de inicio y cierre
  const formattedFechaInicio = safeFormatDate(item.fechaInicio);
  const formattedFechaCierre = safeFormatDate(item.fechaFin);

  // ----------------------------------------------------------------------------------------------------------------
  // Renderizado de la tarjeta de historial
  // ----------------------------------------------------------------------------------------------------------------
  return (
    <View style={styles.historialCard}>
      <Text style={styles.historialCardText}>Nombre: {item.tituloPrograma}</Text>
      <Text style={styles.historialCardText}>Beneficio: {item.beneficio}</Text>
      <Text style={styles.historialCardText}>Tipo: {item.tipo}</Text>
      <Text style={styles.historialCardText}>Descripción: {item.descripcion}</Text>
      <Text style={styles.historialCardText}>Semestre: {item.semestre}</Text>
      <Text style={styles.historialCardText}>Estado: {item.estado}</Text>
      <Text style={styles.historialCardText}>Fecha Inicio: {formattedFechaInicio}</Text>
      <Text style={styles.historialCardText}>Fecha Cierre: {formattedFechaCierre}</Text>
      <Text style={styles.historialCardText}>Horas: {item.totalHoras}</Text>
    </View>
  );
};

//---------------------------------------------------------------------------------------------------------------
// Componente GestionAsignaturas - Pantalla principal para la gestión de asignaturas
//---------------------------------------------------------------------------------------------------------------
// Este componente permite al profesor gestionar cursos, proyectos y su historial de asignaciones.
// Incluye funcionalidades de búsqueda y filtrado para facilitar la navegación por los datos.

const GestionAsignaturas = () => {
  // Definición de estados para los datos y la búsqueda
  const [courses, setCourses] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselSearchText, setCarouselSearchText] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [historialSearchText, setHistorialSearchText] = useState("");
  const [filteredHistorial, setFilteredHistorial] = useState([]);

  // useNavigation permite navegar entre pantallas
  // useRoute permite acceder a los parámetros de la ruta actual
  // En este caso, se obtiene el ID de usuario y la información de contacto del profesor
  const route = useRoute();
  const { userId, contactInfo } = route.params;
  const navigation = useNavigation();

  //---------------------------------------------------------------------------------------------------------------
  // useEffect para cargar los cursos y proyectos al iniciar el componente
  //---------------------------------------------------------------------------------------------------------------
  // Se ejecuta una vez al montar el componente y cada vez que cambia el userId
  useEffect(() => {
    // Función para obtener los cursos y proyectos del profesor
    const fetchCourses = async () => {
      try {
        const apiUrl = `${URL}:3000`;
        const response = await axios.get(`${apiUrl}/moduloProfesores/getCursos/${userId}`);
        if (response.status === 200) {
          setCourses(response.data);
          setFilteredCourses(response.data);
        }
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
    // espere el usuario
  }, [userId]);

  //---------------------------------------------------------------------------------------------------------------
  // useEffect para cargar el historial de asignaciones al iniciar el componente
  //---------------------------------------------------------------------------------------------------------------
  // Se ejecuta una vez al montar el componente y cada vez que cambia el userId

  useEffect(() => {
    // Función para obtener el historial de asignaciones del profesor
    const fetchHistorial = async () => {
      try {
        const apiUrl = `${URL}:3000`;
        const response = await axios.get(`${apiUrl}/moduloProfesores/getHistorial/${userId}`);
        if (response.status === 200) {
          setHistorial(response.data);
          setFilteredHistorial(response.data);
        }
      } catch (error) {
        Alert.alert("No posee historial de asignaciones:");
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
    // espere el usuario
  }, [userId]);

  //---------------------------------------------------------------------------------------------------------------
  // Funciones para manejar la búsqueda y filtrado de cursos y proyectos
  //---------------------------------------------------------------------------------------------------------------
  // Filtra por nombre de curso o proyecto
  const handleCarouselSearch = () => {
    const filteredC = courses.filter((item) =>
      item.nombre.toLowerCase().includes(carouselSearchText.toLowerCase())
    );
    setFilteredCourses(filteredC);
  };

  // Resetear el filtro del carrusel
  const resetCarousel = () => {
    setCarouselSearchText("");
    setFilteredCourses(courses);
  };

  // Funcion para manejar el regreso a la pantalla anterior
  const handleRegresar = () => {
    navigation.goBack();
  };

  // filtra por año 
  const filterHistorialByYear = () => {
    const filtered = historial.filter(
      (item) => item.fechaInicio === historialSearchText
    );
    setFilteredHistorial(filtered);
  };

  // filtra por estado
  const filterHistorialByState = () => {
    const filtered = historial.filter(
      (item) => item.estado.toLowerCase() === historialSearchText.toLowerCase()
    );
    setFilteredHistorial(filtered);
  };

  // Resetear el filtro del historial
  const resetHistorial = () => {
    setHistorialSearchText("");
    setFilteredHistorial(historial);
  };

  //---------------------------------------------------------------------------------------------------------------
  // Renderizado del componente principal
  //---------------------------------------------------------------------------------------------------------------
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>Cargando Asistencias...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Gestión de Asignaturas</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Carrusel de Cursos y Proyectos</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en el carrusel..."
          value={carouselSearchText}
          onChangeText={setCarouselSearchText}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.searchButton} onPress={handleCarouselSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetCarousel}>
          <Text style={styles.buttonText}>Restablecer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.regresarButton} onPress={handleRegresar}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subSectionTitle}>Cursos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carouselContainer}>
        {filteredCourses.map((course, index) => (
          <View key={course.id || index} style={styles.card}>
            <Text style={styles.cardTitle}>{course.nombre}</Text>
            <Text style={styles.cardDetail}>Código: {course.codigo}</Text>
            <Text style={styles.cardDetail}>Créditos: {course.creditos}</Text>
            <Text style={styles.cardDetail}>Semestre: {course.semestre}</Text>
            <Text style={styles.cardDetail}>Aula: {course.aula}</Text>
            <Text style={styles.cardDetail}>Profesor: {contactInfo.nombre}</Text>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => navigation.navigate("creacionOfertasProfesores", { course })}
            >
              <Text style={styles.cardButtonText}>Solicitar Asistente</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <Text style={styles.subSectionTitle}>Proyectos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carouselContainer}>
        {filteredProyectos.map((proyecto, index) => (
          <View key={proyecto.id || index} style={styles.card}>
            <Text style={styles.cardTitle}>{proyecto.nombre}</Text>
            <Text style={styles.cardDetail}>Código: {proyecto.codigo}</Text>
            <Text style={styles.cardDetail}>Créditos: {proyecto.creditos}</Text>
            <Text style={styles.cardDetail}>Semestre: {proyecto.semestre}</Text>
            <Text style={styles.cardDetail}>Aula: {proyecto.aula}</Text>
            <Text style={styles.cardDetail}>Profesor: {contactInfo.nombre}</Text>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => navigation.navigate("creacionOfertasProfesores", { proyecto })}
            >
              <Text style={styles.cardButtonText}>Solicitar Asistente</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <Text style={styles.subSectionTitle}>Historial</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Escribe para filtrar Historial..."
          value={historialSearchText}
          onChangeText={setHistorialSearchText}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.searchButton} onPress={filterHistorialByYear}>
          <Text style={styles.buttonText}>Filtrar Año</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={filterHistorialByState}>
          <Text style={styles.buttonText}>Filtrar Estado</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetHistorial}>
          <Text style={styles.buttonText}>Restablecer</Text>
        </TouchableOpacity>
      </View>
      
      {filteredHistorial.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay asignaciones pendientes</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historialContainer}>
          {filteredHistorial.map((item, index) => (
            <HistorialCard key={`${item.id}-${index}`} item={item} />
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default GestionAsignaturas;