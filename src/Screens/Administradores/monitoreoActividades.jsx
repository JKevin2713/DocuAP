// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../../Style/Administradores/monitoreoActividades';
import URL from '../../Services/url';
import axios from 'axios';



//---------------------------------------------------------------------------------------------------------------
// Componente MonitoreoActividades - Pantalla para monitorear actividades
//---------------------------------------------------------------------------------------------------------------
// Este componente permite al administrador monitorear las actividades realizadas por los usuarios, filtrando por asistencia, responsable y estado.
// Se utiliza un FlatList para mostrar la información de manera eficiente y un TextInput para realizar búsquedas.
//---------------------------------------------------------------------------------------------------------------
const MonitoreoActividades = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState('');
  const [filtradas, setFiltradas] = useState();
  const route = useRoute();


  //---------------------------------------------------------------------------------------------------------------
  // useEffect para cargar la información de las asistencias al montar el componente
  //---------------------------------------------------------------------------------------------------------------
  // Se realiza una llamada a la API para obtener la información de las asistencias y se almacenan en el estado correspondiente.
  // Se utiliza un useEffect para realizar la llamada a la API al montar el componente.
  useEffect(() => {
    const obtenerAsistencias= async () => {
      try {
        const response = await axios.get(`${URL}:3000/admin/monitoreoAsistencia`);
        console.log('Asistencias obtenidas:', response.data);
        setFiltradas(response.data.asistencias);
      } catch (error) {
        console.error('Error al obtener las asistencias:', error);
      }
    };
    obtenerAsistencias();
  }, []);
    

  //---------------------------------------------------------------------------------------------------------------
  // Función para realizar la búsqueda de actividades
  //---------------------------------------------------------------------------------------------------------------
  // Esta función filtra la lista de actividades según el texto ingresado en el TextInput.
  // Se utiliza el método filter para buscar coincidencias en los campos de asistencia, responsable y estado.
  // Se actualiza el estado de filtradas con los resultados de la búsqueda.
  const realizarBusqueda = () => {
    const texto = busqueda.toLowerCase();
    const resultado = seguimientoData.filter(item =>
      item.asistencia.toLowerCase().includes(texto) ||
      item.responsable.toLowerCase().includes(texto) ||
      item.estado.toLowerCase().includes(texto)
    );
    setFiltradas(resultado);
  };

  //---------------------------------------------------------------------------------------------------------------
  // Renderizado de cada elemento de la lista
  //---------------------------------------------------------------------------------------------------------------
  // Esta función se encarga de renderizar cada elemento de la lista de actividades.
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Asistencia:</Text>
        <Text style={styles.value}>{item.asistencia}</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>Período:</Text>
        <Text style={styles.value}>{item.periodo}</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>Responsable:</Text>
        <Text style={styles.value}>{item.responsable}</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>Estado:</Text>
        <View style={styles.cellEstado}>
            <View style={item.estado === 'Aprobada' ? styles.badgeGreen : styles.badgeRed}>
            <Text style={styles.badgeText}>{item.estado}</Text>
            </View>
        </View>
        </View>


    </View>
  );

  //---------------------------------------------------------------------------------------------------------------
  // Renderizado del componente
  //---------------------------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Header con logo y perfil */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../../assets/LogoTec.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity>
          <Image
            source={require('../../../assets/avataricon.png')}
            style={styles.headerAvatar}
          />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.header}>Monitoreo de actividades</Text>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por actividad, responsable o estado"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity onPress={realizarBusqueda} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de actividades */}
      <FlatList
        data={filtradas}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* Botón regresar */}
      <TouchableOpacity
        style={styles.returnButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.returnButtonText}>Regresar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MonitoreoActividades;
