//---------------------------------------------------------------------------------------------------------------

// Home Page de estudiantes aqui se le permite a los estudiantes hacer 
// Registro de perfil academico, Busqueda de oportunidades, Postulacion de ofertas, seguimiento de actividades

//----------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Para navegación entre pantallas
import { styles } from '../../Style/Estudiantes/homePageEstudiantes'; // Archivo de estilos
import AsyncStorage from '@react-native-async-storage/async-storage'; // Almacenamiento local del ID del usuario
import axios from 'axios'; // Cliente HTTP para peticiones al backend
import URL from '../../Services/url'; // URL base del backend

//--------------------------------------
// Componente principal de la pantalla 
//--------------------------------------

const HomePageEstudiantes = () => {
  const navigation = useNavigation();

  // Estado para guardar los datos de contacto del estudiante
  const [contactInfo, setContactInfo] = useState(null);

  // Opciones del menú
  const options = [
    "Registro y edición del perfil",
    "Busqueda y aplicacion de oportunidades",
    "Seguimiento de actividades"
  ];

  // Mapeo de nombre de opción a la ruta correspondiente
  const screenMapping = {
    "Registro y edición del perfil": "RegistroEdicionEstudiantes",
    "Busqueda y aplicacion de oportunidades": "busquedaApliOportunidades",
    "Seguimiento de actividades": "seguimientoSolicitudes",
  };

  // useEffect se ejecuta al montar el componente
  useEffect(() => {
    const fetchContactInfo = async () => {
      const userId = await AsyncStorage.getItem('userId'); // Se obtiene el userId almacenado localmente
      console.log("Consultando datos del estudiante con userId:", userId);
      if (!userId) return;

      try {
        const apiUrl = `${URL}:3000`;
        // Se hace una petición al backend para obtener los datos del estudiante
        const response = await axios.get(`${apiUrl}/estudiantes/infoEstudiantes`, {
          params: { userId }
        });

        const datos = response.data.datos;

        // Se estructura la información de contacto que se mostrará
        const contactData = {
          correo: datos.correo,
          telefono: datos.telefono,
          nombreResponsable: datos.nombre,
          apellidosResponsable: datos.apellidos || '',
          escuelaDepartamento: datos.carrera || 'No asignado',
          sede: datos.sede || 'Sin sede',
        };

        setContactInfo(contactData); // Se guarda en el estado
      } catch (error) {
        console.error("Error al cargar datos del estudiante:", error);
      }
    };

    fetchContactInfo(); // Se ejecuta la función al cargar
  }, []);

  // Mientras se cargan los datos se muestra un spinner
  if (!contactInfo) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#002b5c" />
        <Text style={{ textAlign: 'center', marginTop: 10 }}>Cargando datos del estudiante...</Text>
      </View>
    );
  }
//--------------------------------------
// Renderización de la pantalla principal
//--------------------------------------

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado con logo y avatar */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../../assets/LogoTec.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate('perfilEstudiante')}>
          <Image
            source={require('../../../assets/avataricon.png')}
            style={styles.headerAvatar}
          />
        </TouchableOpacity>
      </View>

      {/* Sección de información del estudiante */}
      <Text style={styles.title}>Información de Contacto</Text>
      <View style={styles.contactContainer}>
        <Text style={styles.headerText}>Mis Datos</Text>
        <Text style={styles.label}>
          Correo: <Text style={styles.value}>{contactInfo.correo}</Text>
        </Text>
        <Text style={styles.label}>
          Teléfono: <Text style={styles.value}>{contactInfo.telefono}</Text>
        </Text>
        <Text style={styles.label}>
          Responsable: <Text style={styles.value}>{contactInfo.nombreResponsable} {contactInfo.apellidosResponsable}</Text>
        </Text>
        <Text style={styles.label}>
          Escuela / Departamento: <Text style={styles.value}>{contactInfo.escuelaDepartamento}</Text>
        </Text>
        <Text style={styles.label}>
          Sede: <Text style={styles.value}>{contactInfo.sede}</Text>
        </Text>
      </View>

      {/* Sección de menú de navegación */}
      <Text style={{
        color: 'black',
        fontSize: 16,
        textAlign: 'left',
        marginVertical: 10,
        fontWeight: 'bold'
      }}>
        Publicación de Ofertas de Asistencias, Tutorías y Proyectos
      </Text>

      <View style={styles.buttonsContainer}>
        {options.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => {
              const route = screenMapping[label]; // Se busca la ruta asociada
              if (route) {
                navigation.navigate(route); // Navega a la pantalla correspondiente
              } else {
                alert(`Ruta no definida para: ${label}`); // Mensaje si no existe ruta
              }
            }}
          >
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Imagen ilustrativa inferior */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/Login/ImagenLogin.png')}
          style={styles.image}
        />
      </View>
    </ScrollView>
  );
};

export default HomePageEstudiantes;
