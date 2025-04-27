//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente de React Native muestra una lista de cursos y programas de la escuela.
// Permite filtrar por tipo (curso/programa), búsqueda por nombre y controlar la cantidad de elementos mostrados.
// Se conecta al backend para traer datos usando Axios.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Hooks de navegación y rutas
import axios from 'axios';
import URL from '../../Services/url'; // URL base del servidor
import { styles } from '../../Style/Module1/cursoEscuela'; // Estilos personalizados

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Visualización de cursos y programas de la escuela
//---------------------------------------------------------------------------------------------------------------
export default function App() {
  // Estados principales
  const [busqueda, setBusqueda] = useState(''); // Texto de búsqueda
  const [vista, setVista] = useState('todos'); // Vista actual: todos, curso o programa
  const [cantidadMostrar, setCantidadMostrar] = useState(10); // Cantidad de elementos a mostrar
  const [dataApi, setDataApi] = useState([]); // Datos obtenidos de la API

  const navigator = useNavigation(); // Hook de navegación
  const route = useRoute();
  const { userId } = route.params; // Extraer userId recibido como parámetro

  //-------------------------------------------------------------------------------------------------------------
  // Hook para obtener información al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const datos = await handleInformacion();
      if (datos) {
        setDataApi(datos); // Guardar datos fusionados de cursos y programas
      }
    };
    fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener cursos y programas desde el servidor
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/cursosEscuela`, { params: { userId } });

      if (response.status === 200) {
        const cursos = response.data.cursos || [];
        const programas = response.data.programas || [];

        // Fusionar cursos y programas en un solo arreglo
        const fusion = [
          ...cursos.map(curso => ({
            id: curso.id,
            nombre: curso.nombre,
            estudiantes: curso.estudiantes?.length || 0,
            profesor: curso.profesor?.nombre || 'Sin nombre',
            semestre: curso.semestre,
            tipo: curso.tipo
          })),
          ...programas.map(programa => ({
            id: programa.id,
            nombre: programa.nombre,
            estudiantes: 0, // Podría cambiarse si se tiene dato real
            profesor: '-', // No aplica profesor en programa
            semestre: programa.semestre || '',
            tipo: programa.tipo
          }))
        ];
        return fusion;
      } else {
        console.error('Error en la respuesta:', response.statusText);
        alert('Error al obtener los datos.');
        return [];
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      alert('Error de red o del servidor.');
      return [];
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Memoización para aplicar filtros de búsqueda y tipo de vista
  //-------------------------------------------------------------------------------------------------------------
  const filtrado = useMemo(() => {
    const datosFiltrados = dataApi.filter((item) => {
      const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideVista = vista === 'todos' || item.tipo === vista;
      return coincideBusqueda && coincideVista;
    });
    return datosFiltrados.slice(0, cantidadMostrar); // Limitar cantidad mostrada
  }, [busqueda, vista, cantidadMostrar, dataApi]);

  //-------------------------------------------------------------------------------------------------------------
  // Definición del encabezado de la lista
  //-------------------------------------------------------------------------------------------------------------
  const header = useMemo(
    () => (
      <>
        <Text style={styles.header}>Programas de la escuela</Text>

        {/* Barra de búsqueda y cantidad de entradas */}
        <View style={styles.searchRow}>
          <Text style={styles.label}>Mostrar</Text>
          <TextInput
            style={styles.entriesBox}
            keyboardType="numeric"
            value={String(cantidadMostrar)}
            onChangeText={(text) => {
              const num = parseInt(text);
              setCantidadMostrar(isNaN(num) ? 0 : num);
            }}
          />
          <TextInput
            style={styles.search}
            placeholder="Buscar..."
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

        {/* Botones de selección de tipo de vista */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={vista === 'todos' ? styles.toggleButtonActive : styles.toggleButton}
            onPress={() => setVista('todos')}
          >
            <Text style={vista === 'todos' ? styles.toggleTextActive : styles.toggleText}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={vista === 'curso' ? styles.toggleButtonActive : styles.toggleButton}
            onPress={() => setVista('curso')}
          >
            <Text style={vista === 'curso' ? styles.toggleTextActive : styles.toggleText}>Cursos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={vista === 'programa' ? styles.toggleButtonActive : styles.toggleButton}
            onPress={() => setVista('programa')}
          >
            <Text style={vista === 'programa' ? styles.toggleTextActive : styles.toggleText}>Programas</Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [busqueda, vista, cantidadMostrar]
  );

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado del FlatList con los datos filtrados
  //-------------------------------------------------------------------------------------------------------------
  return (
    <FlatList
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      data={filtrado}
      numColumns={2}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.cardsContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text>Estudiantes: {item.estudiantes}</Text>
          <Text>Profesor: {item.profesor}</Text>
          <Text>{item.semestre}</Text>
        </View>
      )}
    />
  );
}
