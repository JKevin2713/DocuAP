//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Pantalla que permite visualizar y editar la información de contacto de una Escuela o Departamento.
// - Muestra correo, teléfono y nombre
// - Permite actualizar los datos a través de una API REST
//---------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../Style/Module1/infoEscuela'; // Importar estilos
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import URL from '../../Services/url'; // URL base de API

//---------------------------------------------------------------------------------------------------------------
// Componente principal - ContactInfoScreen
//---------------------------------------------------------------------------------------------------------------
export default function ContactInfoScreen() {
  // Estados del componente
  const [formData, setFormData] = useState(null);         // Datos actuales editables
  const [originalData, setOriginalData] = useState(null); // Copia para cancelar cambios
  const [isEditing, setIsEditing] = useState(false);      // Modo edición
  const route = useRoute();
  const { userId } = route.params; // Recibir userId como parámetro de navegación

  //-------------------------------------------------------------------------------------------------------------
  // Efecto de carga inicial: obtiene la información del servidor al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const datos = await handleInformacion();
      if (datos) {
        // Eliminar campos no relevantes (fechaCreacion, programas)
        const { fechaCreacion, programas, ...filteredData } = datos;
        setFormData(filteredData);
        setOriginalData(filteredData);
      }
    };
    fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener la información desde la API
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
  // Función para actualizar el valor de los inputs controlados
  //-------------------------------------------------------------------------------------------------------------
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función para guardar los cambios en la API
  //-------------------------------------------------------------------------------------------------------------
  const handleSave = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.put(`${apiUrl}/escuelas/actualizarInfoEscuela`, { userId, formData });

      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Error al guardar los datos.");
    }
    setOriginalData(formData); // Actualizar copia de respaldo
    setIsEditing(false);        // Salir de modo edición
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función para cancelar los cambios
  //-------------------------------------------------------------------------------------------------------------
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado condicional: Muestra indicador de carga mientras se obtienen los datos
  //-------------------------------------------------------------------------------------------------------------
  if (!formData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#002b5c" />
      </SafeAreaView>
    );
  }

  //-------------------------------------------------------------------------------------------------------------
  // Estructura principal de la pantalla
  //-------------------------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Encabezado visual */}
        <View style={styles.header}>
          <Image source={require('../../../assets/Login/ImagenLogin.png')} style={styles.image} />
          <Text style={styles.title}>Información de Contacto</Text>
        </View>

        {/* Card de datos editables */}
        <View style={styles.card}>
          {renderInput("Correo", "correo")}
          {renderInput("Teléfono", "telefono")}
          {renderInput("Nombre del departamento", "nombre")}
        </View>

        {/* Botonera para editar / guardar / cancelar */}
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <Button mode="contained" style={styles.button} buttonColor="#002b5c" onPress={handleSave}>
                Guardar
              </Button>
              <Button mode="outlined" style={styles.button} onPress={handleCancel}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button mode="contained" style={styles.button} buttonColor="#002b5c" onPress={() => setIsEditing(true)}>
              Actualizar datos
            </Button>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );

  //-------------------------------------------------------------------------------------------------------------
  // Subcomponente para renderizar cada input o dato de forma controlada
  //-------------------------------------------------------------------------------------------------------------
  function renderInput(label, key) {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <TextInput
            value={formData[key]}
            onChangeText={(text) => handleChange(key, text)}
            style={styles.input}
          />
        ) : (
          <Text style={styles.text}>{formData[key]}</Text>
        )}
      </View>
    );
  }
}
