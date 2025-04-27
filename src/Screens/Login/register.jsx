//---------------------------------------------------------------------------------------------------------------
// Archivo: LoginScreenSimple.jsx
// Descripción general:
// Componente de React Native para el inicio de sesión básico de usuarios.
// Realiza la conexión al backend usando Axios, maneja navegación, y muestra alertas básicas de éxito/error.
//---------------------------------------------------------------------------------------------------------------

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook para navegación entre pantallas
import { styles } from '../../Style/Login/login'; // Estilos personalizados
import axios from 'axios'; // Cliente HTTP para peticiones al backend
import URL from '../../Services/url'; // URL base definida en archivo de servicios

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Pantalla de inicio de sesión
//---------------------------------------------------------------------------------------------------------------
const LoginScreen = () => {
  const [email, setEmail] = useState(''); // Estado para almacenar correo electrónico
  const [password, setPassword] = useState(''); // Estado para almacenar contraseña
  const navigation = useNavigation(); // Inicializar navegación

  //-------------------------------------------------------------------------------------------------------------
  // Función para redirigir a la página de registro
  //-------------------------------------------------------------------------------------------------------------
  const handleRegistro = () => {
    navigation.navigate("registroPage");
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función principal para manejar el inicio de sesión
  //-------------------------------------------------------------------------------------------------------------
  const handleInicioSeccion = async () => {
    try {
      const storedUrl = URL; // Obtener URL base del servidor
      const apiUrl = `${storedUrl}:3000`; // Construir la URL completa agregando el puerto

      // Realizar solicitud POST con las credenciales
      const response = await axios.post(`${apiUrl}/login`, {
        email: email,
        password: password
      });
      
      // Si el login es exitoso
      if (response.status === 200) {
        alert("Login exitoso");
        navigation.navigate("homePage"); // Redirigir a la página principal
      } else {
        alert("Error: " + response.data.message);
      }

    } catch (error) {
      // Manejo de errores: red o backend
      console.error("Error al hacer la solicitud:", error);
      alert("Error de red o servidor.");
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado de la interfaz de inicio de sesión
  //-------------------------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <Text style={styles.subtitle}>Gestión de Asistencias, Tutorías y Proyectos de Investigación</Text>

      {/* Campo para ingresar correo electrónico */}
      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Campo para ingresar contraseña */}
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botón para redirigir al registro */}
      <TouchableOpacity onPress={handleRegistro}>
        <Text style={styles.forgotPassword}>Registrarse</Text>
      </TouchableOpacity>

      {/* Botón para iniciar sesión */}
      <TouchableOpacity style={styles.button} onPress={handleInicioSeccion}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Imagen decorativa */}
      <Image source={require('../../../assets/Login/ImagenLogin.png')} style={styles.image} />
    </View>
  );
};

//---------------------------------------------------------------------------------------------------------------
// Exportación del componente para uso en navegación
//---------------------------------------------------------------------------------------------------------------
export default LoginScreen;
