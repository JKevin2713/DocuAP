import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../../Style/Module1/actualizarPoliticas.js';

export default function PolicyUpdateScreen() {
  const [formData, setFormData] = useState({
    promedio: '',
    horas: '',
    cursos: '',
    requisitos: '',
  });

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleUpdate = () => {
    console.log('Datos actualizados:', formData);
    // Aquí puedes hacer una petición a la base de datos o API
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/LogoTec.png")} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.title}>Actualización de políticas</Text>
        <View style={styles.card}>
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

          <Text style={styles.label}>Cursos aprobados</Text>
          <TextInput
            style={styles.textArea}
            value={formData.cursos}
            onChangeText={(text) => handleChange('cursos', text)}
            multiline
          />

          <Text style={styles.label}>Requisitos adicionales</Text>
          <TextInput
            style={styles.textArea}
            value={formData.requisitos}
            onChangeText={(text) => handleChange('requisitos', text)}
            multiline
          />

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