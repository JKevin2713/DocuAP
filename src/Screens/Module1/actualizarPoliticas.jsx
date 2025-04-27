//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente de React Native permite a los usuarios actualizar políticas relacionadas a promedios,
// horas requeridas, cursos aprobados y requisitos adicionales.
// Utiliza inputs controlados y simula el envío de datos para actualización.
//---------------------------------------------------------------------------------------------------------------

import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper'; // Componente de botón estilizado
import { styles } from '../../Style/Module1/actualizarPoliticas.js'; // Importación de estilos personalizados

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Pantalla de Actualización de Políticas
//---------------------------------------------------------------------------------------------------------------
export default function PolicyUpdateScreen() {
  const [formData, setFormData] = useState({
    promedio: '',
    horas: '',
    cursos: '',
    requisitos: '',
  }); // Estado inicial para el formulario

  //-------------------------------------------------------------------------------------------------------------
  // Función para manejar cambios en los inputs
  //-------------------------------------------------------------------------------------------------------------
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value }); // Actualiza el estado con el nuevo valor del input
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función para manejar el envío/actualización de datos
  //-------------------------------------------------------------------------------------------------------------
  const handleUpdate = () => {
    console.log('Datos actualizados:', formData);
    // Aquí podría realizarse una petición a la base de datos o API real
  };

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado del formulario de actualización
  //-------------------------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Logo institucional */}
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/LogoTec.png")} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Título principal */}
        <Text style={styles.title}>Actualización de políticas</Text>

        {/* Tarjeta de formulario */}
        <View style={styles.card}>

          {/* Fila de inputs para promedio y horas */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Promedio mínimo</Text>
              <TextInput
                style={styles.input}
                value={formData.promedio}
                onChangeText={(text) => handleChange('promedio', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Horas por semestre</Text>
              <TextInput
                style={styles.input}
                value={formData.horas}
                onChangeText={(text) => handleChange('horas', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Input para cursos aprobados */}
          <Text style={styles.label}>Cursos aprobados</Text>
          <TextInput
            style={styles.textArea}
            value={formData.cursos}
            onChangeText={(text) => handleChange('cursos', text)}
            multiline
          />

          {/* Input para requisitos adicionales */}
          <Text style={styles.label}>Requisitos adicionales</Text>
          <TextInput
            style={styles.textArea}
            value={formData.requisitos}
            onChangeText={(text) => handleChange('requisitos', text)}
            multiline
          />

          {/* Botón de actualización */}
          <Button
            mode="contained"
            buttonColor="#002b5c"
            style={styles.button}
            onPress={handleUpdate}
          >
            Actualizar datos
          </Button>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
