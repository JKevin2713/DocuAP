// Importaciones necesarias
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../Style/Profesores/editarSeguimiento'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import URL from '../../Services/url';

// ---------------------------------------------------------------------------------------------------------------
// Componente EditarSeguimiento - Pantalla para editar el seguimiento de un estudiante
// ---------------------------------------------------------------------------------------------------------------
// Este componente permite al usuario editar los datos de seguimiento de un estudiante específico.
const EditarSeguimiento = () => {

  // Definición de estados para los campos del formulario
  const [tutoriasCumplidas, setTutoriasCumplidas] = useState('');
  const [asistenciasCumplidas, setAsistenciasCumplidas] = useState('');
  const [cumplimientoTareas, setCumplimientoTareas] = useState('');
  const [tutoriasPorCumplir, setTutoriasPorCumplir] = useState('');
  const [asistenciasPorCumplir, setAsistenciasPorCumplir] = useState('');
  const [tareasPorCumplir, setTareasPorCumplir] = useState('');

  // Hooks para navegación y ruta
  // useNavigation permite navegar entre pantallas
  // useRoute permite acceder a los parámetros de la ruta actual
  // En este caso, se obtiene el ID de asistencia para editar el registro correspondiente
  const navigation = useNavigation();
  const route = useRoute();
  const { asistenciaId } = route.params;

  //---------------------------------------------------------------------------------------------------------------
  // Función para manejar la edición del registro de seguimiento
  //---------------------------------------------------------------------------------------------------------------
  // Esta función se encarga de enviar los datos editados al servidor para actualizar el registro en la base de datos
  const handleEditarRegistro = async () => {
    try {
      const data = {
        tutoriasCumplidas,
        asistenciasCumplidas,
        cumplimientoTareas,
        tutoriasPorCumplir,
        asistenciasPorCumplir,
        tareasPorCumplir
      };

      const response = await axios.patch(
        `${URL}:3000/moduloProfesores/updateSeguimiento/${asistenciaId}`,
        data
      );

      if (response.status === 200) {
        console.log("Registro actualizado:", response.data.message);
        alert("Registro actualizado correctamente");
        navigation.goBack();
      } else {
        alert("Error al actualizar el registro");
      }
    } catch (error) {
      console.error("Error al editar registro:", error);
      alert("Ocurrió un error al actualizar.");
    }
  };

  //---------------------------------------------------------------------------------------------------------------
  // Función para manejar el regreso a la pantalla anterior
  //---------------------------------------------------------------------------------------------------------------
  const handleRegresar = () => {
    console.log("Regresar");
    navigation.goBack();
  };

  //---------------------------------------------------------------------------------------------------------------
  // Renderizado del componente
  //---------------------------------------------------------------------------------------------------------------
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Editar Seguimiento</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Cantidad de Tutorías cumplidas</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese número..."
          value={tutoriasCumplidas}
          onChangeText={setTutoriasCumplidas}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Cantidad de Asistencias cumplidas</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese número..."
          value={asistenciasCumplidas}
          onChangeText={setAsistenciasCumplidas}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Cumplimiento de Tareas</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese porcentaje..."
          value={cumplimientoTareas}
          onChangeText={setCumplimientoTareas}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tutorías por cumplir</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese número..."
          value={tutoriasPorCumplir}
          onChangeText={setTutoriasPorCumplir}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Asistencias por cumplir</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese número..."
          value={asistenciasPorCumplir}
          onChangeText={setAsistenciasPorCumplir}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tareas por cumplir</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese número..."
          value={tareasPorCumplir}
          onChangeText={setTareasPorCumplir}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditarRegistro}>
          <Text style={styles.buttonText}>Editar Registro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleRegresar}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditarSeguimiento;