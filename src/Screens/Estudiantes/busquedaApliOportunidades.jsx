//---------------------------------------------------------------------------------------------------------------

// Busqueda de oportunidades -Sistema de filtros por departamento, profesor, promedio, horarios y palabras clave.

//----------------------------------------------------------------------------------------------------------------


import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Para navegar entre pantallas
import { styles } from '../../Style/Estudiantes/busquedaApliOportunidades'; // Estilos externos
import axios from 'axios'; // Cliente HTTP para consumir la API
import URL from '../../Services/url'; // URL base del backend

//--------------------------------------
// Componente principal
//--------------------------------------

const BusquedaOportunidades = () => {
  const navigation = useNavigation(); // Hook para navegar
  const [busqueda, setBusqueda] = useState(''); // Texto ingresado en el buscador
  const [oportunidades, setOportunidades] = useState([]); // Todas las oportunidades desde el backend
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]); // Resultados filtrados para mostrar

  // Cargar oportunidades al montar el componente
  useEffect(() => {
    const fetchOportunidades = async () => {
      try {
        const response = await axios.get(`${URL}:3000/asistencias/oportunidades`);
        console.log("🔍 Oportunidades cargadas:", response.data.oportunidades);

        // Guardar las oportunidades tanto en el listado completo como en los filtrados
        setOportunidades(response.data.oportunidades);
        setResultadosFiltrados(response.data.oportunidades);
      } catch (error) {
        console.error("Error al obtener oportunidades:", error.message);
      }
    };

    fetchOportunidades(); // Llamada a la API
  }, []);

  // Función para filtrar resultados según la búsqueda
  const realizarBusqueda = () => {
    const texto = busqueda.toLowerCase();

    // Se filtran las oportunidades por coincidencia en título, escuela o encargado
    const filtrados = oportunidades.filter(item =>
      item.titulo.toLowerCase().includes(texto) ||
      item.escuela.toLowerCase().includes(texto) ||
      item.encargado.toLowerCase().includes(texto)
    );

    setResultadosFiltrados(filtrados); // Se actualizan los resultados mostrados
  };

//--------------------------------------
// Renderización de la pantalla principal
//--------------------------------------

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado con logo e ícono de perfil */}
      <View style={styles.headerBar}>
        <Image source={require('../../../assets/LogoTec.png')} style={styles.headerLogo} resizeMode="contain" />
        <TouchableOpacity onPress={() => navigation.navigate('perfilEstudiante')}>
          <Image source={require('../../../assets/avataricon.png')} style={styles.headerAvatar} />
        </TouchableOpacity>
      </View>

      {/* Título de la pantalla */}
      <Text style={styles.title}>Búsqueda y Aplicación a Oportunidades</Text>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, escuela o encargado"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity onPress={realizarBusqueda} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Contenedor de tarjetas de oportunidades */}
      <View style={styles.cardsContainer}>
        {resultadosFiltrados.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardText}>Escuela: {item.escuela}</Text>
            <Text style={styles.cardText}>Encargado: {item.encargado}</Text>
            <Text style={styles.cardText}>{item.horas}</Text>

            {/* Botones de acción dentro de la tarjeta */}
            <View style={styles.cardButtons}>
              {/* Navega a la pantalla de detalles pasando todos los datos */}
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigation.navigate('detallesOportunidad', {
                  ...item // Pasa toda la info como props
                })}
              >
                <Text style={styles.buttonText}>Detalles</Text>
              </TouchableOpacity>

              {/* Navega al formulario de aplicación pasando solo el título */}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => navigation.navigate('formularioAplicacion', { titulo: item.titulo })}
              >
                <Text style={styles.buttonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default BusquedaOportunidades;
