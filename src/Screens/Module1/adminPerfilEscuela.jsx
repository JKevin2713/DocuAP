import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../Style/Module1/adminPerfilEscuela.js';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import URL from '../../Services/url';


export default function ProfileRegistrationScreen(){
  const [schoolName, setSchoolName] = useState('');
  const [faculty, setFaculty] = useState('');
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const datos = await handleInformacion();
      if (datos) {
        const { nombre, facultad } = datos;
        setSchoolName(nombre || '');
        setFaculty(facultad || '');
      }      
    };
    fetchData();
  }, []);

  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/infoEscuela`, { params : {userId }});
      return response.data.datos;
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error de red o del servidor.");
      return null;
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/LogoTec.png")} style={styles.logo} resizeMode="contain" />
        </View>

      <View style={styles.titleBox}>
        <Text style={styles.title}>Registro y administración de perfiles</Text>
      </View>

      <View style={styles.subTitleBox}>
        <Text style={styles.subTitle}>Información de la Escuela o Departamento</Text>
      </View>

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

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
