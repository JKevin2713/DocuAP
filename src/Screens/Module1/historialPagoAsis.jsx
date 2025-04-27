//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente de React Native muestra una lista de estudiantes con sus beneficios de matrícula o pagos.
// Permite filtrar por carrera, nivel académico y estado de beneficio (Activo, Aprobada, Todos).
// Se conecta al backend para traer la información de asistencias activas.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Componente Picker para dropdowns
import { styles } from '../../Style/Module1/historialPagoAsis'; // Estilos personalizados
import { useRoute } from '@react-navigation/native'; // Hook para acceder a parámetros de ruta
import URL from '../../Services/url'; // URL base del servidor
import axios from 'axios'; // Cliente HTTP

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Lista de Estudiantes con Beneficios
//---------------------------------------------------------------------------------------------------------------
export default function ListaEstudiantes() {
  // Estados principales
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [datos, setDatos] = useState([]); // Datos obtenidos de la API

  const route = useRoute();
  const { userId } = route.params; // Obtener el userId de los parámetros de navegación

  //-------------------------------------------------------------------------------------------------------------
  // Hook para cargar los datos al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const data = await handleInformacion();
      setDatos(data);
    };
    fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función que conecta al backend y trae el historial de pagos/asistencias activos
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/historialPagoAsisActivos`, { params: { userId } });

      if (response.status === 200) {
        console.log('Datos obtenidos:', response.data);
        return response.data || [];
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
  // Cálculo del total de beneficios por tipo (exoneraciones y pagos)
  //-------------------------------------------------------------------------------------------------------------
  const beneficioExoneracion = datos
    .filter(d => d.tipo === 'Exoneración')
    .reduce((sum, d) => sum + parseInt(d.monto), 0);

  const beneficioPago = datos
    .filter(d => d.tipo === 'Pago' || d.tipo === 'Tutoria')
    .reduce((sum, d) => sum + parseInt(d.monto), 0);

  //-------------------------------------------------------------------------------------------------------------
  // Aplicar filtros dinámicos de carrera, nivel y estado
  //-------------------------------------------------------------------------------------------------------------
  const datosFiltrados = datos.filter(d => {
    return (carrera === '' || d.carrera === carrera) &&
           (nivel === '' || d.nivel === nivel) &&
           (filtroEstado === 'Todos' || d.estado === filtroEstado);
  });

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado principal de pantalla
  //-------------------------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>

      {/* Tarjetas de resumen */}
      <View style={styles.cardsContainer}>
        <Card title="Exoneración de Matrícula" value={beneficioExoneracion} />
        <Card title="Pagos por Hora" value={beneficioPago} />
      </View>

      {/* Filtros por carrera y nivel académico */}
      <View style={styles.filtersRow}>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={carrera}
            style={styles.picker}
            onValueChange={value => setCarrera(value)}
          >
            <Picker.Item label="Carrera" value="" />
            <Picker.Item label="Computación" value="Computación" />
            <Picker.Item label="Administración" value="Administración" />
            <Picker.Item label="Electrónica" value="Electrónica" />
          </Picker>
        </View>

        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={nivel}
            style={styles.picker}
            onValueChange={value => setNivel(value)}
          >
            <Picker.Item label="Nivel académico" value="" />
            <Picker.Item label="Principiante" value="Principiante" />
            <Picker.Item label="Intermedio" value="Intermedio" />
            <Picker.Item label="Avanzado" value="Avanzado" />
          </Picker>
        </View>
      </View>

      {/* Filtros por estado */}
      <View style={styles.buttonGroup}>
        {['Todos', 'Activo', 'Aprobada'].map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filtroEstado === f && styles.activeButton
            ]}
            onPress={() => setFiltroEstado(f)}
          >
            <Text style={styles.buttonText}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tabla de estudiantes y beneficios */}
      <View style={styles.tableContainer}>
        {/* Encabezado de la tabla */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Estudiante</Text>
          <Text style={styles.headerCell}>Carrera</Text>
          <Text style={styles.headerCell}>Tipo</Text>
          <Text style={styles.headerCell}>Monto</Text>
          <Text style={styles.headerCell}>Semestre</Text>
        </View>

        {/* Lista de resultados */}
        <FlatList
          data={datosFiltrados}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.tableRow,
                { backgroundColor: index % 2 === 0 ? '#f8f9ff' : '#ffffff' }
              ]}
            >
              <Text style={styles.rowCell}>{item.estudiante}</Text>
              <Text style={styles.rowCell}>{item.carrera}</Text>
              <Text style={styles.rowCell}>{item.tipo}</Text>
              <Text style={styles.rowCell}>${item.monto}</Text>
              <Text style={styles.rowCell}>{item.semestre}</Text>
            </View>
          )}
        />
      </View>

    </View>
  );
}

//-------------------------------------------------------------------------------------------------------------
// Componente reutilizable para mostrar una tarjeta de resumen de beneficios
//-------------------------------------------------------------------------------------------------------------
function Card({ title, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>${value.toLocaleString()}</Text>
    </View>
  );
}
