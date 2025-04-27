// Importaciones necesarias
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { styles } from '../../Style/Profesores/evaluacionDesempeno';
import URL from '../../Services/url';

//---------------------------------------------------------------------------------------------------------------
// Componente EvaluacionDesempeno - Pantalla para evaluar el desempeño de un estudiante
//---------------------------------------------------------------------------------------------------------------
// Este componente permite al profesor evaluar el desempeño de un estudiante en una asistencia específica.
const EvaluacionDesempeno = () => {

  // Definición de estados para los campos del formulario
  const route = useRoute();
  const navigation = useNavigation();
  const { asistenciaId, student } = route.params;
  const [desempenoGeneral, setDesempenoGeneral] = useState("Bueno");
  const [retroalimentacion, setRetroalimentacion] = useState("");

  //---------------------------------------------------------------------------------------------------------------
  // Función para manejar la evaluación del desempeño
  //---------------------------------------------------------------------------------------------------------------
  // Esta función se encarga de enviar los datos de evaluación al servidor para guardarlos en la base de datos
  const handleGuardar = async () => {
    try {
      if (!desempenoGeneral || !retroalimentacion) {
        Alert.alert("Error", "Por favor completa todos los campos.");
        return;
      }
      const apiUrl = `${URL}:3000`;
      const response = await axios.patch(`${apiUrl}/moduloProfesores/addDesempeno/${asistenciaId}`, {
        desempeno: desempenoGeneral,
        retroalimentacion: retroalimentacion,
      });

      if (response.status === 200) {
        Alert.alert("Éxito", "Evaluación guardada exitosamente.");
        navigation.goBack(); 
      } else {
        Alert.alert("Error", "No se pudo guardar la evaluación. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al guardar evaluación:", error.message);
      Alert.alert("Error", "No se pudo guardar la evaluación. Por favor, verifica tu conexión.");
    }
  };

  //---------------------------------------------------------------------------------------------------------------
  // Función para manejar el regreso a la pantalla anterior
  //---------------------------------------------------------------------------------------------------------------
  const handleRegresar = () => {
    navigation.goBack();
  };

  //---------------------------------------------------------------------------------------------------------------
  // Renderizado del formulario de evaluación
  //---------------------------------------------------------------------------------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* El título muestra el nombre del estudiante */}
      <Text style={styles.title}>Evaluación de desempeño de {student.nombre}</Text>

      <View style={styles.fieldContainer}>
        {/* Sección del Picker */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Desempeño General</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={desempenoGeneral}
              onValueChange={(itemValue) => setDesempenoGeneral(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Bueno" value="Bueno" />
              <Picker.Item label="Regular" value="Regular" />
              <Picker.Item label="Malo" value="Malo" />
            </Picker>
          </View>
        </View>

        {/* Sección de Retroalimentación */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Retroalimentación</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ingrese su retroalimentación..."
            multiline={true}
            value={retroalimentacion}
            onChangeText={setRetroalimentacion}
          />
        </View>
      </View>

      {/* Botones de Guardar y Regresar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>Guardar evaluación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.regresarButton]} onPress={handleRegresar}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EvaluacionDesempeno;