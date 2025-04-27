//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente muestra la lista de estudiantes postulados a oportunidades.
// Permite buscar por nombre, filtrar por estado, carrera y nivel académico, 
// y navegar a la pantalla de perfil detallado de cada estudiante.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../Style/Module1/historialPostulantes'; // Estilos personalizados
import URL from '../../Services/url'; // URL base del servidor
import axios from 'axios'; // Cliente HTTP

//---------------------------------------------------------------------------------------------------------------
// Componente principal - EstudiantesPostuladosScreen
//---------------------------------------------------------------------------------------------------------------
export default function EstudiantesPostuladosScreen() {
  // Estados principales
  const [filtro, setFiltro] = useState('Todos'); // Estado del filtro por aprobación
  const [search, setSearch] = useState(''); // Búsqueda por nombre
  const [carreraFilter, setCarreraFilter] = useState(''); // Filtro por carrera
  const [nivelFilter, setNivelFilter] = useState(''); // Filtro por nivel académico
  const [estudiantesData, setEstudiantesData] = useState([]); // Datos de estudiantes postulados

  const navigator = useNavigation(); // Hook para navegación
  const route = useRoute(); // Hook para obtener parámetros de navegación
  const { userId } = route.params; // userId de la escuela o departamento

  //-------------------------------------------------------------------------------------------------------------
  // Hook para cargar los datos de los estudiantes cuando se monta el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const data = await handleInformacion();
      setEstudiantesData(data);
    };
    fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener estudiantes postulados desde el backend
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/historialPostulantes`, {
        params: { userId }
      });

      if (response.status === 200) {
        console.log('Datos obtenidos:', response.data);
        return response.data.estudiantes || [];
      } else {
        console.error('Error al obtener los datos:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return [];
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Aplicar filtros de búsqueda, estado, carrera y nivel
  //-------------------------------------------------------------------------------------------------------------
  const filteredData = estudiantesData.filter((estudiante) => {
    const matchesEstado = filtro === 'Todos' || estudiante.estado === filtro;
    const matchesCarrera = carreraFilter === '' || estudiante.carrera === carreraFilter;
    const matchesNivel = nivelFilter === '' || estudiante.nivel === nivelFilter;
    const matchesSearch = estudiante.nombre.toLowerCase().includes(search.toLowerCase());
    return matchesEstado && matchesCarrera && matchesNivel && matchesSearch;
  });

  // Obtener listas únicas para mostrar en los pickers
  const carreras = [...new Set(estudiantesData.map((item) => item.carrera))];
  const niveles = [...new Set(estudiantesData.map((item) => item.nivel))];

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado principal de la pantalla
  //-------------------------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      
      {/* Encabezado */}
      <Text style={styles.logo}>TEC | Tecnológico de Costa Rica</Text>

      {/* Botones de filtro por estado */}
      <View style={styles.filterRow}>
        {['Todos', 'Aprobado', 'Activo', 'Inactivo'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterButton, filtro === item && styles.activeFilter]}
            onPress={() => setFiltro(item)}
          >
            <Text style={styles.filterText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Barra de búsqueda y selección de filtros adicionales */}
      <View style={styles.controlsRow}>
        <Text>Show</Text>
        <View style={styles.entriesBox}><Text>10</Text></View>
        <Text>entries</Text>

        {/* Búsqueda por nombre */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Filtro por carrera */}
        <View style={styles.filterDropdowns}>
          <Text>Carrera</Text>
          <Picker
            selectedValue={carreraFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setCarreraFilter(itemValue)}
          >
            <Picker.Item label="Todos" value="" />
            {carreras.map((carrera) => (
              <Picker.Item key={carrera} label={carrera} value={carrera} />
            ))}
          </Picker>

          {/* Filtro por nivel académico */}
          <Text>Nivel académico</Text>
          <Picker
            selectedValue={nivelFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setNivelFilter(itemValue)}
          >
            <Picker.Item label="Todos" value="" />
            {niveles.map((nivel) => (
              <Picker.Item key={nivel} label={nivel} value={nivel} />
            ))}
          </Picker>
        </View>

        {/* Ícono de filtros */}
        <Ionicons name="filter-outline" size={24} color="black" />
      </View>

      {/* Títulos de tabla */}
      <Text style={styles.header}>TODOS LOS ESTUDIANTES POSTULADOS</Text>
      <Text style={styles.subheader}>Gestión de todos los estudiantes</Text>

      <View style={styles.tableHeader}>
        {['Nombre', 'Carrera', 'Nivel', 'Ponderado', 'Cursos aprobados', 'Estado', 'Acciones'].map((header) => (
          <Text key={header} style={styles.tableHeaderText}>{header}</Text>
        ))}
      </View>

      {/* Lista de estudiantes filtrados */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.nombre}</Text>
            <Text style={styles.cell}>{item.carrera}</Text>
            <Text style={styles.cell}>{item.nivel}</Text>
            <Text style={styles.cell}>{item.ponderado}</Text>
            <Text style={styles.cell}>{item.cursosAprobados}</Text>
            <Text style={[styles.estado, { backgroundColor: '#D6F5E3', color: '#2B8C58' }]}>{item.estado}</Text>

            {/* Botón para ver detalles del estudiante */}
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigator.navigate("perfilEstudiante", { userId: item.id })}
            >
              <Text style={styles.detailsButtonText}>Detalles</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
