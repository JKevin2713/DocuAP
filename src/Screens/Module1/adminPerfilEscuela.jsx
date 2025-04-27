//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente de React Native permite registrar o actualizar el perfil de una Escuela o Departamento.
// Recupera datos existentes del backend y permite modificarlos y guardarlos.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../Style/Module1/adminPerfilEscuela.js'; // Estilos personalizados
import { useRoute } from '@react-navigation/native'; // Hook para acceder a los parámetros de navegación
import axios from 'axios'; // Cliente HTTP
import URL from '../../Services/url'; // URL base del servidor backend

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Registro y administración de perfil de Escuela o Departamento
//---------------------------------------------------------------------------------------------------------------
export default function ProfileRegistrationScreen() {
  const [schoolName, setSchoolName] = useState(''); // Estado para el nombre de la escuela
  const [faculty, setFaculty] = useState(''); // Estado para la facultad
  const route = useRoute(); // Obtener parámetros de navegación
  const { userId } = route.params; // Extraer userId del parámetro recibido

  //-------------------------------------------------------------------------------------------------------------
  // Hook useEffect para cargar información existente al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const datos = await handleInformacion(); // Llamar función para obtener datos
      if (datos) {
        const { nombre, facultad } = datos;
        setSchoolName(nombre || '');
        setFaculty(facultad || '');
      }
    };
    fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener información actual de la escuela desde el backend
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/infoEscuela`, { params: { userId } });
      return response.data.datos;
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error de red o del servidor.");
      return null;
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función para guardar los cambios de nombre y facultad en el backend
  //-------------------------------------------------------------------------------------------------------------
  const handleSave = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.put(`${apiUrl}/escuelas/actualizarInfoAdmin`, {
        userId,
        nombre: schoolName,
        facultad: faculty
      });
      alert("Cambios guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("No se pudieron guardar los cambios.");
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado de la pantalla de formulario
  //-------------------------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>

      {/* Logo institucional */}
      <View style={styles.logoContainer}>
        <Image source={require("../../../assets/LogoTec.png")} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Título principal */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>Registro y administración de perfiles</Text>
      </View>

      {/* Subtítulo */}
      <View style={styles.subTitleBox}>
        <Text style={styles.subTitle}>Información de la Escuela o Departamento</Text>
      </View>

      {/* Formulario de datos */}
      <View style={styles.formBox}>
        <Text style={styles.label}>1. Nombre de la Escuela o Departamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Escuela de Computación"
          value={schoolName}
          onChangeText={setSchoolName}
        />

        <Text style={styles.label}>2. Facultad a la que pertenece</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Facultad de Ingeniería"
          value={faculty}
          onChangeText={setFaculty}
        />
      </View>

      {/* Botón para guardar cambios */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
