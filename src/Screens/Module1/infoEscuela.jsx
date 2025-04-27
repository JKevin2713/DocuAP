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
import { styles } from '../../Style/Module1/infoEscuela';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import URL from '../../Services/url';

export default function ContactInfoScreen() {
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const datos = await handleInformacion();
      if (datos) {
        // Filtramos las fechas y campos no deseados
        const { fechaCreacion, programas, ...filteredData } = datos;
        setFormData(filteredData);
        setOriginalData(filteredData);
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

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.put(`${apiUrl}/escuelas/actualizarInfoEscuela`, { userId, formData });
      console.log("Respuesta del servidor:", response.data);
      if (response.status === 200) {
        alert(response.data.message);
      }
    } 
    catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Error al guardar los datos.");
    }
    setOriginalData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  if (!formData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#002b5c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image source={require('../../../assets/Login/ImagenLogin.png')} style={styles.image} />
          <Text style={styles.title}>Información de Contacto</Text>
        </View>

        <View style={styles.card}>
          {renderInput("Correo", "correo")}
          {renderInput("Teléfono", "telefono")}
          {renderInput("Nombre del departamento", "nombre")}
          {/* Puedes mostrar otros campos si existen en el JSON */}
        </View>

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

  function renderInput(label: string, key: string) {
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
