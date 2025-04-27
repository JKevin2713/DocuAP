import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../Style/Login/login';
import axios from 'axios'; 
import URL from '../../Services/url'

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  
  const handleRegistro = () => {
    navigation.navigate("registroPage");
  };	

  const handleInicioSeccion = async () => {
    try {
      const storedUrl = URL;  // Esto obtiene la URL que has definido en url.js
      
      // Concatenar correctamente la URL con el puerto
      const apiUrl = `${storedUrl}:3000`; // Asegúrate de usar las comillas correctas
      
      // Usando Axios en vez de fetch
      const response = await axios.post(`${apiUrl}/login`, 
        {
          email: email,
          password: password
        }
      );
      
      if (response.status === 200) { // Verifica si la respuesta es exitosa
        alert("Login exitoso");
        navigation.navigate("homePage");
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error de red o servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <Text style={styles.subtitle}>Gestión de Asistencias, Tutorías y Proyectos de Investigación</Text>

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />


      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => handleRegistro()}>
        <Text style={styles.forgotPassword}>Registrase</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleInicioSeccion()}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <Image source={require('../../../assets/Login/ImagenLogin.png')} style={styles.image} />
    </View>
  );
};

export default LoginScreen;
