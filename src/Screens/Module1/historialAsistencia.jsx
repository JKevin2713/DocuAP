import React, { use, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import { useEffect } from 'react';
import { styles } from '../../Style/Module1/historialAsistencia';
import { useRoute } from '@react-navigation/native';
import URL from '../../Services/url';
import axios from 'axios';


export default function HistorialAsistenciaScreen() {
  const [search, setSearch] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [showSemestreModal, setShowSemestreModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [allData, setAllData] = useState([]); // Estado para almacenar los datos obtenidos de la API
  const route = useRoute();
  const { userId } = route.params; // Obtener el userId de los parámetros de la ruta

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleInformacion();
      setAllData(data); // Actualizar el estado con los datos obtenidos
    };
    fetchData();
  }, []); // Ejecutar la función al montar el componente

  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/historialAsistencias`, {
        params: { userId }
      });

      const data = response.data;

      if (response.status === 200) {
        return data.historialAsistencia || [];
      } else {
        console.error('Error al obtener los datos:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return [];
    } 
  }
  


  // 🔁 Obtener valores únicos de semestre y estado
  const uniqueSemestres = [...new Set(allData.map(item => item.semestre))];
  const uniqueEstados = [...new Set(allData.map(item => item.estado))];

  const filteredData = allData.filter(item =>
    item.curso.toLowerCase().includes(search.toLowerCase()) &&
    (selectedSemestre ? item.semestre === selectedSemestre : true) &&
    (selectedEstado ? item.estado === selectedEstado : true)
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Historial de asistencia</Text>

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

      {/* SEMESTRE MODAL */}
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

      {/* ESTADO MODAL */}
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

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}