//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente de React Native muestra una lista de todos los estudiantes postulados.
// Permite aplicar filtros por estado, carrera, nivel y búsqueda por nombre.
// Se conecta a un backend mediante Axios para obtener los datos.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Button, Avatar, Menu, Provider } from 'react-native-paper'; // Componentes estilizados
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../Style/Module1/asistenciaTotalHist'; // Estilos personalizados
import { useRoute } from '@react-navigation/native';
import URL from '../../Services/url'; // URL base
import axios from 'axios'; // Cliente HTTP

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Lista de Estudiantes
//---------------------------------------------------------------------------------------------------------------
export default function ListaEstudiantes() {
  // Estados principales
  const [estadoFiltro, setEstadoFiltro] = useState(''); // Estado del filtro por estado (activo/inactivo)
  const [busqueda, setBusqueda] = useState(''); // Estado para búsqueda por nombre
  const [menuCarreraVisible, setMenuCarreraVisible] = useState(false); // Menú carrera
  const [menuNivelVisible, setMenuNivelVisible] = useState(false); // Menú nivel
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(''); // Filtro carrera
  const [nivelSeleccionado, setNivelSeleccionado] = useState(''); // Filtro nivel
  const [estudiantes, setEstudiantesData] = useState([]); // Lista de estudiantes
  const navigator = useNavigation(); // Hook de navegación
  const route = useRoute(); // Hook de ruta
  const { userId } = route.params; // Obtener userId de parámetros

  //-------------------------------------------------------------------------------------------------------------
  // Hook para cargar los datos de los estudiantes al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const data = await handleInformacion();
      setEstudiantesData(data);
    };
    fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener la información de los estudiantes postulados
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/historialPostulantes`, {
        params: { userId }
      });

      const data = response.data;
      console.log('Datos obtenidos:', data);

      if (response.status === 200) {
        return data.estudiantes || [];
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
  // Memorizar lista de carreras únicas disponibles para el menú de filtro
  //-------------------------------------------------------------------------------------------------------------
  const carreras = useMemo(() => [...new Set(estudiantes.map(e => e.carrera))], [estudiantes]);

  // Memorizar lista de niveles únicos disponibles para el menú de filtro
  const niveles = useMemo(() => [...new Set(estudiantes.map(e => e.nivel))], [estudiantes]);

  //-------------------------------------------------------------------------------------------------------------
  // Aplicar filtros combinados de estado, nombre, carrera y nivel
  //-------------------------------------------------------------------------------------------------------------
  const estudiantesFiltrados = estudiantes.filter(e => {
    return (
      (estadoFiltro === '' || e.estado === estadoFiltro) &&
      (busqueda === '' || e.nombre.toLowerCase().includes(busqueda.toLowerCase())) &&
      (carreraSeleccionada === '' || e.carrera === carreraSeleccionada) &&
      (nivelSeleccionado === '' || e.nivel === nivelSeleccionado)
    );
  });

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado de la pantalla de estudiantes
  //-------------------------------------------------------------------------------------------------------------
  return (
    <Provider>
      <ScrollView style={styles.container}>

        {/* Filtros por estado */}
        <View style={styles.filtros}>
          <Button onPress={() => setEstadoFiltro('')} style={styles.azulBtn} labelStyle={styles.blancoTexto}>Todos</Button>
          <Button onPress={() => setEstadoFiltro('Aprobado')} style={styles.azulBtn} labelStyle={styles.blancoTexto}>Activos</Button>
          <Button onPress={() => setEstadoFiltro('Inactivo')} style={styles.azulBtn} labelStyle={styles.blancoTexto}>Inactivos</Button>
        </View>

        {/* Barra de búsqueda por nombre */}
        <TextInput
          placeholder="Buscar por nombre..."
          style={styles.searchInput}
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {/* Filtros de carrera y nivel */}
        <View style={styles.filaMenus}>
          {/* Menú de filtro por carrera */}
          <View style={styles.menuContainer}>
            <Menu
              visible={menuCarreraVisible}
              onDismiss={() => setMenuCarreraVisible(false)}
              anchor={
                <Button
                  mode="contained"
                  onPress={() => setMenuCarreraVisible(true)}
                  style={styles.azulBtn}
                  labelStyle={styles.blancoTexto}
                >
                  {carreraSeleccionada || 'Carrera'}
                </Button>
              }
            >
              <Menu.Item onPress={() => { setCarreraSeleccionada(''); setMenuCarreraVisible(false); }} title="Todas" />
              {carreras.map(c => (
                <Menu.Item key={c} onPress={() => { setCarreraSeleccionada(c); setMenuCarreraVisible(false); }} title={c} />
              ))}
            </Menu>
          </View>

          {/* Menú de filtro por nivel académico */}
          <View style={styles.menuContainer}>
            <Menu
              visible={menuNivelVisible}
              onDismiss={() => setMenuNivelVisible(false)}
              anchor={
                <Button
                  mode="contained"
                  onPress={() => setMenuNivelVisible(true)}
                  style={styles.azulBtn}
                  labelStyle={styles.blancoTexto}
                >
                  {nivelSeleccionado || 'Nivel'}
                </Button>
              }
            >
              <Menu.Item onPress={() => { setNivelSeleccionado(''); setMenuNivelVisible(false); }} title="Todos" />
              {niveles.map(n => (
                <Menu.Item key={n} onPress={() => { setNivelSeleccionado(n); setMenuNivelVisible(false); }} title={n} />
              ))}
            </Menu>
          </View>
        </View>

        {/* Títulos de sección */}
        <Text style={styles.titulo}>TODOS LOS ESTUDIANTES POSTULADOS</Text>
        <Text style={styles.subtitulo}>Gestión de todos los estudiantes</Text>

        {/* Tabla de datos */}
        <View style={styles.tabla}>
          {/* Encabezados */}
          <View style={styles.filaEncabezado}>
            <Text style={styles.encabezado}>Nombre</Text>
            <Text style={styles.encabezado}>Carrera</Text>
            <Text style={styles.encabezado}>Nivel</Text>
            <Text style={styles.encabezado}>Ponderado</Text>
            <Text style={styles.encabezado}>Cursos</Text>
            <Text style={styles.encabezado}>Estado</Text>
            <Text style={styles.encabezado}>Acciones</Text>
          </View>

          {/* Filas dinámicas */}
          {estudiantesFiltrados.map((est, index) => (
            <View key={index} style={styles.fila}>
              <Text style={styles.celda}>{est.nombre}</Text>
              <Text style={styles.celda}>{est.carrera}</Text>
              <Text style={styles.celda}>{est.nivel}</Text>
              <Text style={styles.celda}>{est.ponderado}</Text>
              <Text style={styles.celda}>{est.cursosAprobados}</Text>
              <Text style={[
                styles.estado, 
                est.estado === 'Aprobado' ? styles.estadoAprobado : styles.estadoInactivo
              ]}>
                {est.estado}
              </Text>
              {/* Botón para ver detalles del estudiante */}
              <TouchableOpacity
                style={styles.botonDetalles}
                onPress={() => navigator.navigate("perfilEstudiante", { userId: est.id })}
              >
                <Text style={styles.textoDetalles}>Detalles</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </Provider>
  );
}
