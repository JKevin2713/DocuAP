import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../Style/Profesores/editarSeguimiento'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import URL from '../../Services/url';

const EditarSeguimiento = () => {
  const [tutoriasCumplidas, setTutoriasCumplidas] = useState('');
  const [asistenciasCumplidas, setAsistenciasCumplidas] = useState('');
  const [cumplimientoTareas, setCumplimientoTareas] = useState('');
  const [tutoriasPorCumplir, setTutoriasPorCumplir] = useState('');
  const [asistenciasPorCumplir, setAsistenciasPorCumplir] = useState('');
  const [tareasPorCumplir, setTareasPorCumplir] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { asistenciaId } = route.params;

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

  const handleRegresar = () => {
    console.log("Regresar");
    navigation.goBack();
  };

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