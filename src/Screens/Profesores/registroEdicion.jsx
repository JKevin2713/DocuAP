// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from '../../Style/Profesores/registroEdicion';
import axios from 'axios';
import URL from '../../Services/url';

//---------------------------------------------------------------------------------------------------------------
// Componente RegistroEdicion - Pantalla para registrar y editar datos de profesores
//---------------------------------------------------------------------------------------------------------------
// Este componente permite al profesor registrar y editar su información personal y de contacto.
const RegistroEdicion = () => {
  // Hooks para manejar la navegación y la ruta actual
  const route = useRoute();
  const navigation = useNavigation();
  const { contactInfo, carrera, userId } = route.params;

  // Definición de estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sede, setSede] = useState('');

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //---------------------------------------------------------------------------------------------------------------
// useEffect para cargar la información del contacto al montar el componente
//---------------------------------------------------------------------------------------------------------------
  // Se inicializan los campos del formulario con la información del contacto si está disponible.
  // Esto permite al profesor ver y editar su información existente.
  useEffect(() => {
    if (contactInfo) {
      setNombre(contactInfo.nombre || '');
      setCorreo(contactInfo.correo || '');
      setTelefono(contactInfo.telefono || '');
      setSede(contactInfo.sede || '');
    }
  }, [contactInfo]);

  //---------------------------------------------------------------------------------------------------------------
// Función para guardar los cambios realizados en el formulario
//---------------------------------------------------------------------------------------------------------------
  // Esta función se encarga de enviar los datos editados al servidor para actualizar la información del profesor.  
  const guardarCambios = async () => {
    if (showPasswordSection) {
      if (!password || !confirmPassword) {
        return Alert.alert('Error', 'Por favor ingrese y confirme la nueva contraseña.');
      }
      if (password !== confirmPassword) {
        return Alert.alert('Error', 'Las contraseñas no coinciden.');
      }
    }

    const body = { nombre, correo, telefono, sede };
    if (showPasswordSection) body.password = password;

    const apiUrl = `${URL}:3000`;
    try {
      const response = await axios.patch(
        `${apiUrl}/moduloProfesores/updateInfoProfesores/${userId}`,
        body
      );
      if (response.status === 200) {
        Alert.alert('Éxito', 'Cambios guardados correctamente.');
        navigation.navigate('HomePageProfesores', { userId });
      } else {
        Alert.alert('Error', 'No se pudieron guardar los cambios.');
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      Alert.alert('Error', 'Error de conexión. Intente más tarde.');
    }
  };

  //
//---------------------------------------------------------------------------------------------------------------
// Función para regresar a la pantalla anterior
//---------------------------------------------------------------------------------------------------------------
  const regresar = () => navigation.goBack();

  //---------------------------------------------------------------------------------------------------------------
// Renderizado del formulario de registro y edición
//---------------------------------------------------------------------------------------------------------------
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Registro y Edición de Datos</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>1. Nombre Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su nombre"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        {/* Correo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>2. Correo Institucional</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario@itcr.ac.cr"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Teléfono */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>3. Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
        </View>

        {/* Sede */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>4. Sede</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su escuela o departamento"
            value={sede}
            onChangeText={setSede}
          />
        </View>

        {/* Toggle password fields */}
        <TouchableOpacity
          style={[styles.saveButton]}
          onPress={() => setShowPasswordSection(v => !v)}
        >
          <Text style={styles.buttonText}>
            {showPasswordSection ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}
          </Text>
        </TouchableOpacity>

        {/* Password Section */}
        {showPasswordSection && (
  <View style={{ backgroundColor: 'rgba(255,0,0,0.1)' }}>
    
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese nueva contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Repita la contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          
  </View>
)}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={guardarCambios}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.returnButton]} onPress={regresar}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistroEdicion;
