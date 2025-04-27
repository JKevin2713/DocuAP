import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import URL from '../../Services/url';


import { styles } from '../../Style/Module1/cursoEscuela';


export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState('todos');
  const [cantidadMostrar, setCantidadMostrar] = useState(10);
  const [dataApi, setDataApi] = useState([]);
  const navigator = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const datos = await handleInformacion();
      if (datos) {
        setDataApi(datos);
      }
    };

    fetchData();
  }, []);

  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/cursosEscuela`, {
        params: { userId },
      });

      const data = response.data;

      if (response.status === 200) {
        const cursos = data.cursos || [];
        const programas = data.programas || [];

        const fusion = [
          ...cursos.map((curso) => ({
            id: curso.id,
            nombre: curso.nombre,
            estudiantes: curso.estudiantes?.length || 0,
            profesor: curso.profesor?.nombre || 'Sin nombre',
            semestre: curso.semestre,
            tipo: curso.tipo,
          })),
          ...programas.map((programa) => ({
            id: programa.id,
            nombre: programa.nombre,
            estudiantes: 0, // o usar cantidad real si se tiene
            profesor: '-', // o campo válido si aplica
            semestre: programa.semestre || '',
            tipo: programa.tipo,
          })),
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

  const filtrado = useMemo(() => {
    const datosFiltrados = dataApi.filter((item) => {
      const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideVista = vista === 'todos' || item.tipo === vista;
      return coincideBusqueda && coincideVista;
    });
    return datosFiltrados.slice(0, cantidadMostrar);
  }, [busqueda, vista, cantidadMostrar, dataApi]);

  const header = useMemo(
    () => (
      <>
        <Text style={styles.header}>Programas de la escuela</Text>

        <View style={styles.searchRow}>
          <Text style={styles.label}>Show</Text>
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
            placeholder="Search..."
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

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