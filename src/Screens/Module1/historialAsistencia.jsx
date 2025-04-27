//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente de React Native muestra el historial de asistencias de un departamento o escuela.
// Permite aplicar filtros de búsqueda, semestre y estado mediante modales.
// Se conecta al backend para traer la información de las asistencias.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native'; // Hook para acceder a parámetros de ruta
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, Pressable, FlatList
} from 'react-native';
import { styles } from '../../Style/Module1/historialAsistencia'; // Estilos personalizados
import URL from '../../Services/url'; // URL base de conexión al backend
import axios from 'axios'; // Cliente HTTP

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Historial de Asistencias
//---------------------------------------------------------------------------------------------------------------
export default function HistorialAsistenciaScreen() {
  // Estados para filtros y datos
  const [search, setSearch] = useState(''); // Búsqueda por nombre de curso
  const [selectedSemestre, setSelectedSemestre] = useState(''); // Filtro de semestre
  const [selectedEstado, setSelectedEstado] = useState(''); // Filtro de estado
  const [showSemestreModal, setShowSemestreModal] = useState(false); // Modal semestre
  const [showEstadoModal, setShowEstadoModal] = useState(false); // Modal estado
  const [allData, setAllData] = useState([]); // Datos obtenidos de la API

  const route = useRoute();
  const { userId } = route.params; // Obtener ID del usuario desde los parámetros de navegación

  //-------------------------------------------------------------------------------------------------------------
  // Hook para obtener la información al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const data = await handleInformacion();
      setAllData(data);
    };
    fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener historial de asistencias desde el backend
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/historialAsistencias`, { params: { userId } });

      if (response.status === 200) {
        return response.data.historialAsistencia || [];
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
  // Variables derivadas: valores únicos para filtros
  //-------------------------------------------------------------------------------------------------------------
  const uniqueSemestres = [...new Set(allData.map(item => item.semestre))];
  const uniqueEstados = [...new Set(allData.map(item => item.estado))];

  //-------------------------------------------------------------------------------------------------------------
  // Aplicar filtros de búsqueda, semestre y estado
  //-------------------------------------------------------------------------------------------------------------
  const filteredData = allData.filter(item =>
    item.curso.toLowerCase().includes(search.toLowerCase()) &&
    (selectedSemestre ? item.semestre === selectedSemestre : true) &&
    (selectedEstado ? item.estado === selectedEstado : true)
  );

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado de cada item de asistencia
  //-------------------------------------------------------------------------------------------------------------
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardDate}>{item.fecha}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Estudiante:</Text>
        <Text style={styles.value}>{item.estudiante}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Tutor:</Text>
        <Text style={styles.value}>{item.tutor}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Curso:</Text>
        <Text style={styles.value}>{item.curso}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Semestre:</Text>
        <Text style={styles.value}>{item.semestre}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.estado}>{item.estado}</Text>
      </View>
    </View>
  );

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado principal de pantalla
  //-------------------------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Historial de asistencia</Text>

      {/* Buscador y botones de filtro */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          placeholder="Buscar por curso..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowSemestreModal(true)}>
          <Text style={styles.filterText}>{selectedSemestre || 'Semestre'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowEstadoModal(true)}>
          <Text style={styles.filterText}>{selectedEstado || 'Estado'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar semestre */}
      <Modal transparent visible={showSemestreModal} animationType="slide">
        <Pressable style={styles.modalBackground} onPress={() => setShowSemestreModal(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Seleccionar Semestre</Text>
            {uniqueSemestres.map(sem => (
              <TouchableOpacity
                key={sem}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedSemestre(sem);
                  setShowSemestreModal(false);
                }}>
                <Text>{sem}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => { setSelectedSemestre(''); setShowSemestreModal(false); }}>
              <Text style={styles.modalClear}>Limpiar filtro</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Modal para seleccionar estado */}
      <Modal transparent visible={showEstadoModal} animationType="slide">
        <Pressable style={styles.modalBackground} onPress={() => setShowEstadoModal(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Seleccionar Estado</Text>
            {uniqueEstados.map(est => (
              <TouchableOpacity
                key={est}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedEstado(est);
                  setShowEstadoModal(false);
                }}>
                <Text>{est}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => { setSelectedEstado(''); setShowEstadoModal(false); }}>
              <Text style={styles.modalClear}>Limpiar filtro</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Lista de asistencias filtradas */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
