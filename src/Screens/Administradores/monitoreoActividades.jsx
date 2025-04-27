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




const MonitoreoActividades = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState('');
  const [filtradas, setFiltradas] = useState();
  const route = useRoute();


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
    

  const realizarBusqueda = () => {
    const texto = busqueda.toLowerCase();
    const resultado = seguimientoData.filter(item =>
      item.asistencia.toLowerCase().includes(texto) ||
      item.responsable.toLowerCase().includes(texto) ||
      item.estado.toLowerCase().includes(texto)
    );
    setFiltradas(resultado);
  };

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
