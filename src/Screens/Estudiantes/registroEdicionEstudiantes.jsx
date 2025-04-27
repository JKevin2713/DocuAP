//---------------------------------------------------------------------------------------------------------------

// Registro de perfil academico - Creación con correo institucional, ingreso de carrera y nivel,
// carga de documentos, sincronización de notas y promedio.

//----------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Selector tipo dropdown
import * as DocumentPicker from 'expo-document-picker'; // Selección de archivos
import AsyncStorage from '@react-native-async-storage/async-storage'; // Almacenamiento local
import axios from 'axios'; // Cliente HTTP
import { useNavigation } from '@react-navigation/native'; // Navegación entre pantallas
import { styles } from '../../Style/Estudiantes/resgistroEdicionEstudiantes'; // Estilos personalizados
import URL from '../../Services/url'; // URL base del backend

//--------------------------------------
//  Componente principal
//--------------------------------------

const RegistroPerfilAcademico = () => {
  const navigation = useNavigation();

  // Estados locales para almacenar la información del formulario
  const [correo, setCorreo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [nivelAcademico, setNivelAcademico] = useState('');
  const [promedio, setPromedio] = useState('');
  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [documento, setDocumento] = useState(null);
  const [carrerasDisponibles, setCarrerasDisponibles] = useState([]);

  // Hook que se ejecuta al cargar la pantalla
  useEffect(() => {
    const cargarDatos = async () => {
      const userId = await AsyncStorage.getItem('userId'); // Se obtiene el ID del usuario
      if (!userId) return;

      // Obtener datos personales (correo)
      try {
        const resUsuario = await axios.get(`${URL}:3000/escuelas/infoEscuela`, {
          params: { userId }
        });
        const datos = resUsuario.data.datos;
        setCorreo(datos.correo || '');
      } catch (error) {
        console.error("Error al cargar correo:", error.message);
      }

      // Obtener lista de carreras desde el backend
      try {
        const resCarreras = await axios.get(`${URL}:3000/estudiantes/carreras`);
        setCarrerasDisponibles(resCarreras.data.carreras || []);
      } catch (error) {
        console.error("Error al cargar carreras:", error.message);
      }
    };

    cargarDatos(); // Ejecutar función
  }, []);

//---------------------------------------
// Selección de documento desde el
// explorador de archivos
//--------------------------------------

  const seleccionarDocumento = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') setDocumento(result);
  };

  // Sincroniza los datos académicos desde la base (promedio y cursos)
  const sincronizarDatosAcademicos = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await axios.get(`${URL}:3000/estudiantes/infoEstudiantes`, {
        params: { userId }
      });

      const datos = res.data.datos;
      setPromedio(datos.ponderado || '');
      setCursosAprobados(datos.cursosAprovados || []);
      Alert.alert("Sincronización exitosa", "Se sincronizó el promedio y los cursos aprobados.");
    } catch (error) {
      console.error("Error al sincronizar datos:", error.message);
      Alert.alert("Error", "No se pudo sincronizar los datos académicos.");
    }
  };

  //--------------------------------------
  // Función para enviar los datos al 
  // backend
  //--------------------------------------

  const registrarPerfil = async () => {
    if (!carrera || !nivelAcademico) {
      Alert.alert("Campos incompletos", "Por favor complete todos los campos antes de registrar.");
      return;
    }

    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Alert.alert("Error", "No se encontró el usuario.");
      return;
    }

    try {
      await axios.post(`${URL}:3000/estudiantes/registrarPerfil`, {
        userId,
        carrera,
        nivelAcademico,
        promedio
      });

      Alert.alert("Perfil registrado", "Tu perfil académico ha sido registrado correctamente.");
    } catch (error) {
      console.error("❌ Error al registrar perfil académico:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo registrar el perfil académico.");
    }
  };
//--------------------------------------
// Renderización del componente
//--------------------------------------
  
  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePageEstudiantes')}>
          <Image source={require('../../../assets/LogoTec.png')} style={styles.headerLogo} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/avataricon.png')} style={styles.headerAvatar} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Registro de Perfil Académico</Text>
      </View>

      {/* Campo correo */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>1. Correo Institucional</Text>
        <TextInput style={styles.input} value={correo} editable={false} />
      </View>

      {/* Campo carrera (dropdown) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>2. Carrera</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={carrera} onValueChange={setCarrera}>
            <Picker.Item label="Seleccione una carrera..." value="" />
            {carrerasDisponibles.map((c, idx) => (
              <Picker.Item label={c} value={c} key={idx} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Campo nivel académico */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>3. Nivel académico</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={nivelAcademico} onValueChange={setNivelAcademico}>
            <Picker.Item label="Seleccione..." value="" />
            <Picker.Item label="Bachillerato" value="bachillerato" />
            <Picker.Item label="Licenciatura" value="licenciatura" />
            <Picker.Item label="Maestría" value="maestria" />
          </Picker>
        </View>
      </View>

      {/* Botón para sincronizar datos */}
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={sincronizarDatosAcademicos}>
          <Text style={styles.buttonText}>Sincronizar datos académicos</Text>
        </TouchableOpacity>
      </View>

      {/* Campo promedio */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>4. Promedio ponderado</Text>
        <TextInput
          style={styles.input}
          value={promedio}
          onChangeText={setPromedio}
          keyboardType="decimal-pad"
          placeholder="Ej: 85.5"
        />
      </View>

      {/* Campo cursos aprobados */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>5. Cursos aprobados</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={cursosAprobados.join('\n')}
          editable={false}
          multiline
        />
      </View>

      {/* Subida de documento adicional */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>6. Documento adicional</Text>
        <TouchableOpacity onPress={seleccionarDocumento}>
          <View style={styles.documentUploadBox}>
            <Text style={styles.uploadPlaceholder}>
              {documento ? documento.name : '[Tocar para seleccionar]'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Botón para registrar el perfil */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={registrarPerfil}>
          <Text style={styles.buttonText}>Registrar perfil académico</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegistroPerfilAcademico;
