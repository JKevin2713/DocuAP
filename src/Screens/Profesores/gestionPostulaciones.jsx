// Importaciones necesarias
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "../../Style/Profesores/gestionPostulaciones";
import axios from "axios";
import URL from "../../Services/url";

//---------------------------------------------------------------------------------------------------------------
// Función para formatear la fecha
//---------------------------------------------------------------------------------------------------------------
const formatDate = (timestamp) => {
  try {
    if (!timestamp) return "";
    if (typeof timestamp === "object" && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    }
    return typeof timestamp === "string" ? timestamp : "";
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha inválida";
  }
};

//---------------------------------------------------------------------------------------------------------------
// Componente GestionPostulaciones - Pantalla para gestionar postulaciones
//---------------------------------------------------------------------------------------------------------------
// Este componente permite al profesor gestionar las postulaciones de los estudiantes, filtrarlas y ver detalles específicos.
const GestionPostulaciones = () => {
  // Hooks para manejar la navegación y la ruta actual
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, contactInfo } = route.params;
  // estado para manejar las postulaciones y su filtrado
  const [postulaciones, setPostulaciones] = useState([]);
  const [filteredPostulaciones, setFilteredPostulaciones] = useState([]);
  
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos"); 
    
  const [loading, setLoading] = useState(true);

  //---------------------------------------------------------------------------------------------------------------
  // useEffect para cargar las postulaciones al montar el componente
  //---------------------------------------------------------------------------------------------------------------
  // Se realiza una llamada a la API para obtener las postulaciones relacionadas con el usuario
  // y se almacenan en el estado correspondiente.
  useEffect(() => {
    // Función para obtener las solicitudes relacionadas con asistencias
    const fetchSolicitudes = async () => {
      try {
        const apiUrl = `${URL}:3000`;
        const response = await axios.get(`${apiUrl}/moduloProfesores/getSolicitudesRelacionadasConAsistencias/${userId}`);
        if (response.status === 200) {
          setPostulaciones(response.data);
          setFilteredPostulaciones(response.data);
        } else {
          console.error("Error al obtener postulaciones:", response.statusText);
          Alert.alert("Error", "No se pudieron cargar las postulaciones.");
        }
      } catch (error) {
        console.error("Error al obtener postulaciones:", error.message);
        Alert.alert("Error", "Error al cargar las postulaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
    // espera al usuario para que se carguen las postulaciones antes de aplicar el filtro
  }, [userId]);

  //---------------------------------------------------------------------------------------------------------------
  // Función para manejar el filtrado de postulaciones
  //---------------------------------------------------------------------------------------------------------------
  const handleFilter = () => {
    let filtered = [...postulaciones];

    if (selectedFilter.toLowerCase().trim() === "aprobados") {
      filtered = filtered.filter((p) => 
        p.estado && p.estado.toLowerCase().trim() === "aprobado"
      );
    } else if (selectedFilter.toLowerCase().trim() === "pendiente") {
      filtered = filtered.filter((p) => 
        p.estado && p.estado.toLowerCase().trim() === "pendiente"
      );
    } else if (selectedFilter.toLowerCase().trim() === "promedio") {
      filtered.sort((a, b) => Number(b.promedio) - Number(a.promedio));
    }
    if (searchText.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.nombre && p.nombre.toLowerCase().trim().includes(searchText.toLowerCase().trim())
      );
    }

    setFilteredPostulaciones(filtered);
  };

  //---------------------------------------------------------------------------------------------------------------
  // Función para restablecer los filtros y la búsqueda
  //---------------------------------------------------------------------------------------------------------------
  const resetFilter = () => {
    setSearchText("");
    setSelectedFilter("Todos");
    setFilteredPostulaciones(postulaciones);
  };

  //---------------------------------------------------------------------------------------------------------------
  // Renderizado del componente
  //---------------------------------------------------------------------------------------------------------------
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Cargando Postulaciones...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gestión de Postulaciones</Text>

      {/* Sección de filtros y búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleFilter}>
          <Text style={styles.searchButtonText}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={resetFilter}>
          <Text style={styles.searchButtonText}>Restablecer</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de filtro */}
      <View style={styles.allFilterButtonsContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === "Todos" && styles.activeFilterButton]}
          onPress={() => setSelectedFilter("Todos")}
        >
          <Text style={styles.filterButtonText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === "Aprobados" && styles.activeFilterButton]}
          onPress={() => setSelectedFilter("Aprobados")}
        >
          <Text style={styles.filterButtonText}>Aprobados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === "Pendiente" && styles.activeFilterButton]}
          onPress={() => setSelectedFilter("Pendiente")}
        >
          <Text style={styles.filterButtonText}>Pendiente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === "Promedio" && styles.activeFilterButton]}
          onPress={() => setSelectedFilter("Promedio")}
        >
          <Text style={styles.filterButtonText}>Promedio</Text>
        </TouchableOpacity>
      </View>

      {/* Carrusel (horizontal) de cards de postulaciones */}
      <Text style={styles.subSectionTitle}>Postulaciones</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carouselContainer}>
        {filteredPostulaciones.map((postulacion) => (
          <View key={postulacion.id} style={styles.card}>
            <Text style={styles.cardTitle}>{postulacion.nombre}</Text>
            <Text style={styles.cardDetail}>
              Título Oportunidad: {postulacion.tituloOportunidad}
            </Text>
            <Text style={styles.cardDetail}>
              Estado: {postulacion.estado ? postulacion.estado.toLowerCase().trim() : ""}
            </Text>
            <Text style={styles.cardDetail}>Nota: {postulacion.nota}</Text>
            <Text style={styles.cardDetail}>Promedio: {postulacion.promedio}</Text>
            <Text style={styles.cardDetail}>
              Fecha: {postulacion.fecha ? formatDate(postulacion.fecha) : ""}
            </Text>
            <Text style={styles.cardDetail}>Correo: {postulacion.correo}</Text>
            <Text style={styles.cardDetail}>Horas: {postulacion.horas}</Text>
            <Text style={styles.cardDetail}>Teléfono: {postulacion.telefono}</Text>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => navigation.navigate("InfoEstudiante", { student: postulacion })}
            >
              <Text style={styles.cardButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Botón Regresar */}
      <View style={styles.regresarContainer}>
        <TouchableOpacity style={styles.regresarButton} onPress={() => navigation.goBack()}>
          <Text style={styles.regresarButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GestionPostulaciones;