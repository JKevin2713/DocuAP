//---------------------------------------------------------------------------------------------------------------
// Archivo: LoginScreen.jsx
// Descripción general:
// Componente de React Native que maneja el inicio de sesión para diferentes tipos de usuarios (estudiante, profesor, escuela, admin).
// Se conecta a un backend mediante Axios, guarda datos de sesión localmente con AsyncStorage, y navega según el rol del usuario.
//---------------------------------------------------------------------------------------------------------------

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook para navegación entre pantallas
import { styles } from '../../Style/Login/login'; // Estilos personalizados
import axios from 'axios'; // Cliente HTTP para conectar con el backend
import URL from '../../Services/url.js'; // URL base del servidor backend
import AsyncStorage from '@react-native-async-storage/async-storage'; // Almacenamiento local seguro

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Pantalla de inicio de sesión
//---------------------------------------------------------------------------------------------------------------
const LoginScreen = () => {
  const [email, setEmail] = useState(''); // Estado para almacenar el correo
  const [password, setPassword] = useState(''); // Estado para almacenar la contraseña
  const navigation = useNavigation(); // Inicialización del hook de navegación

  //-------------------------------------------------------------------------------------------------------------
  // Función para navegar hacia la pantalla de registro (actualmente comentada en el diseño)
  //-------------------------------------------------------------------------------------------------------------
  const handleRegistro = () => {
    navigation.navigate("registroPage");
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función principal para manejar el inicio de sesión
  //-------------------------------------------------------------------------------------------------------------
  const handleInicioSeccion = async () => {
    try {
      const apiUrl = `${URL}:3000`; // Construir la URL base del backend
      const response = await axios.post(`${apiUrl}/login`, { email, password }); // Enviar POST con credenciales

      if (response.status === 200) {
        const { rol, id } = response.data;

        // Guardar userId y rol en AsyncStorage (almacenamiento local)
        await AsyncStorage.setItem('userId', id);
        await AsyncStorage.setItem('rol', rol);

        // Redirigir a la página correspondiente según el rol
        if (rol === "estudiante") {
          alert("Login exitoso como estudiante");
          navigation.navigate("HomePageEstudiantes", { userId: id });

        } else if (rol === "profesor") {
          alert("Login exitoso como profesor");
          navigation.navigate("HomePageProfesores", { userId: id });

        } else if (rol === "escuela") {
          alert("Login exitoso como escuela");
          navigation.navigate("homePageEscuela", { userId: id });

        } else if (rol === "admin") {
          alert("Login exitoso como administrador");
          navigation.navigate("HomePageAdmin", { userId: id });
        }
      }

    } catch (error) {
      // Manejo de errores: credenciales inválidas o errores de red
      if (error.response?.status === 401) {
        alert(error.response.data.message);
      } else {
        console.error("Error al hacer la solicitud:", error);
        alert("Error de red o del servidor.");
      }
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado del formulario de inicio de sesión
  //-------------------------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <Text style={styles.subtitle}>Gestión de Asistencias, Tutorías y Proyectos</Text>

      {/* Campo para el correo electrónico */}
      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Campo para la contraseña */}
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    
      {/* Botón opcional para registrarse (actualmente comentado) */}
      {/* 
      <TouchableOpacity onPress={handleRegistro}>
        <Text style={styles.forgotPassword}>Registrarse</Text>
      </TouchableOpacity>
      */}

      {/* Botón para iniciar sesión */}
      <TouchableOpacity style={styles.button} onPress={handleInicioSeccion}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Imagen decorativa en la pantalla de login */}
      <Image source={require('../../../assets/Login/ImagenLogin.png')} style={styles.image} />
    </View>
  );
};

//---------------------------------------------------------------------------------------------------------------
// Exportación del componente para uso en navegación
//---------------------------------------------------------------------------------------------------------------
export default LoginScreen;
