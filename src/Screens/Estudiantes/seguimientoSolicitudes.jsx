//---------------------------------------------------------------------------------------------------------------

// Seguimiento de actividades - Visualización de historial, monitoreo de horas, evaluaciones recibidas 
// y descarga de certificados.

//----------------------------------------------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { styles } from '../../Style/Estudiantes/seguimientoSolicitudes';
import URL from '../../Services/url';

//--------------------------------------
//  Componente principal
//--------------------------------------

const SeguimientoSolicitudes = () => {
  const navigation = useNavigation(); // Hook para navegar entre pantallas
  const [busqueda, setBusqueda] = useState(''); // Estado para texto del buscador
  const [seguimientoData, setSeguimientoData] = useState([]); // Datos originales
  const [filtradas, setFiltradas] = useState([]); // Datos filtrados por búsqueda

  // Hook que se ejecuta cada vez que la pantalla gana el foco
  useFocusEffect(
    useCallback(() => {
      const fetchSolicitudes = async () => {
        try {
          // Obtiene el userId guardado localmente
          const userId = await AsyncStorage.getItem('userId');

          // Solicita al backend las solicitudes de ese usuario
          const response = await axios.get(`${URL}:3000/solicitudes/seguimiento`, {
            params: { userId }
          });

          // Elimina duplicados basándose en el título
          const unicos = [];
          const titulosVistos = new Set();

          for (const solicitud of response.data.solicitudes) {
            if (!titulosVistos.has(solicitud.titulo)) {
              titulosVistos.add(solicitud.titulo);
              unicos.push(solicitud);
            }
          }

          // Actualiza los estados con los datos únicos
          setSeguimientoData(unicos);
          setFiltradas(unicos);
        } catch (error) {
          console.error("Error al obtener seguimiento:", error.message);
          Alert.alert("Error", "No se pudo cargar el seguimiento de tus solicitudes.");
        }
      };

      fetchSolicitudes(); // Llama la función cuando la pantalla se enfoca
    }, [])
  );

//--------------------------------------
// Filtra los datos según lo ingresado 
// en el buscador
//--------------------------------------

  const realizarBusqueda = () => {
    const texto = busqueda.toLowerCase();
    const resultado = seguimientoData.filter(item =>
      item.tipoBeca.toLowerCase().includes(texto) ||
      item.responsable.toLowerCase().includes(texto) ||
      item.estado.toLowerCase().includes(texto)
    );
    setFiltradas(resultado);
  };

//--------------------------------------
// Renderización del componente
//--------------------------------------
  
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Tipo de beca:</Text>
        <Text style={styles.value}>{item.tipoBeca}</Text>
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
        <Text style={styles.badgeGreen}>{item.estado}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Horas trabajadas:</Text>
        <Text style={item.alertaHoras ? styles.badgeOrange : styles.value}>
          {item.horasTrabajadas}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Avances:</Text>
        {item.avances ? (
          <TouchableOpacity onPress={() => Alert.alert('Avance', 'Descargando archivo de avances...')}>
            <Text style={styles.downloadLink}>Descargar</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.value}>No disponible</Text>
        )}
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Retroalimentación:</Text>
        {item.retroalimentacion ? (
          <TouchableOpacity onPress={() => Alert.alert('Retroalimentación', 'Descargando archivo...')}>
            <Text style={styles.downloadLink}>Descargar</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.value}>No disponible</Text>
        )}
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Certificados:</Text>
        {item.certificados ? (
          <TouchableOpacity onPress={() => Alert.alert('Certificado', 'Descargando archivo...')}>
            <Text style={styles.downloadLink}>Descargar</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.value}>No disponible</Text>
        )}
      </View>
    </View>
  );

  // Render principal del componente
  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado con logo y avatar */}
      <View style={styles.headerBar}>
        <Image source={require('../../../assets/LogoTec.png')} style={styles.headerLogo} resizeMode="contain" />
        <TouchableOpacity onPress={() => navigation.navigate('perfilEstudiante')}>
          <Image source={require('../../../assets/avataricon.png')} style={styles.headerAvatar} />
        </TouchableOpacity>
      </View>

      {/* Título de pantalla */}
      <Text style={styles.header}>Seguimiento de actividades</Text>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por tipo de beca, responsable o estado"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity onPress={realizarBusqueda} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de solicitudes */}
      <FlatList
        data={filtradas}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default SeguimientoSolicitudes;
