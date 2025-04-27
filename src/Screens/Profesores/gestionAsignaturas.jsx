import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { styles } from "../../Style/Profesores/gestionAsignaturas";
import axios from "axios";
import URL from "../../Services/url"; 
import { useNavigation, useRoute } from '@react-navigation/native';

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

  const formattedFechaInicio = safeFormatDate(item.fechaInicio);
  const formattedFechaCierre = safeFormatDate(item.fechaFin);

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

const GestionAsignaturas = () => {
  const [courses, setCourses] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselSearchText, setCarouselSearchText] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [historialSearchText, setHistorialSearchText] = useState("");
  const [filteredHistorial, setFilteredHistorial] = useState([]);
  const route = useRoute();
  const { userId, contactInfo } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
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
  }, [userId]);

  useEffect(() => {
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
  }, [userId]);

  const handleCarouselSearch = () => {
    const filteredC = courses.filter((item) =>
      item.nombre.toLowerCase().includes(carouselSearchText.toLowerCase())
    );
    setFilteredCourses(filteredC);
  };

  const resetCarousel = () => {
    setCarouselSearchText("");
    setFilteredCourses(courses);
  };

  const handleRegresar = () => {
    navigation.goBack();
  };

  const filterHistorialByYear = () => {
    const filtered = historial.filter(
      (item) => item.fechaInicio === historialSearchText
    );
    setFilteredHistorial(filtered);
  };

  const filterHistorialByState = () => {
    const filtered = historial.filter(
      (item) => item.estado.toLowerCase() === historialSearchText.toLowerCase()
    );
    setFilteredHistorial(filtered);
  };

  const resetHistorial = () => {
    setHistorialSearchText("");
    setFilteredHistorial(historial);
  };

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