//---------------------------------------------------------------------------------------------------------------

// Formulario de aplicacion - Aplicación directa, subida de archivos, notificaciones sobre estado de postulación.

//----------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import URL from '../../Services/url';
import { styles } from '../../Style/Estudiantes/formularioAplicacion';

// Componente principal del formulario de aplicación
const FormularioAplicacion = () => {
  const navigation = useNavigation(); // Hook de navegación
  const route = useRoute(); // Hook para obtener parámetros de la ruta
  const { titulo } = route.params || {}; // Obtiene el título de la oportunidad desde la ruta
  const [documento, setDocumento] = useState(null); // Estado para almacenar archivo adicional

  // Estado para los campos del formulario
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    promedio: '',
    horas: '',
    nota: '',
    comentarios: ''
  });

  // Obtiene los datos personales automáticamente al cargar el componente
  useEffect(() => {
    const fetchDatosPersonales = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      try {
        const response = await axios.get(`${URL}:3000/escuelas/infoEscuela`, {
          params: { userId }
        });

        const datos = response.data.datos;

        // Rellena automáticamente los campos del formulario con los datos obtenidos
        setFormulario(prev => ({
          ...prev,
          nombre: datos.nombre || '',
          correo: datos.correo || '',
          telefono: datos.telefono || ''
        }));
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error.message);
      }
    };

    fetchDatosPersonales();
  }, []);

  // Actualiza el estado del formulario cuando cambia un campo
  const handleChange = (key, value) => {
    setFormulario({ ...formulario, [key]: value });
  };

  // Abre el selector de archivos y guarda el archivo elegido
  const seleccionarDocumento = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') setDocumento(result);
  };

  // Envía la solicitud al backend
  const aplicar = async () => {
    // Valida que todos los campos obligatorios estén llenos
    const camposObligatorios = ['nombre', 'correo', 'telefono', 'promedio', 'horas', 'nota', 'comentarios'];

    for (let campo of camposObligatorios) {
      if (!formulario[campo] || formulario[campo].trim() === '') {
        Alert.alert("Campos incompletos", "Por favor complete todos los campos requeridos antes de enviar.");
        return;
      }
    }

    try {
      const userId = await AsyncStorage.getItem('userId');

      const payload = {
        ...formulario,
        documento: documento?.name || null, // El nombre del archivo seleccionado
        tituloOportunidad: titulo,
        userId
      };

      await axios.post(`${URL}:3000/solicitudes/registrar`, payload);

      Alert.alert("Éxito", "Tu solicitud fue enviada correctamente");
      navigation.goBack(); // Regresa a la pantalla anterior
    } catch (error) {
      console.error("Error al registrar solicitud:", error);
      Alert.alert("Error", "No se pudo registrar la solicitud.");
    }
  };

  // Renderizado del formulario
  return (
    <ScrollView style={styles.container}>
      {/* Barra de encabezado con logo y botón de regreso */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePageEstudiantes')}>
          <Image source={require('../../../assets/LogoTec.png')} style={styles.headerLogo} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/avataricon.png')} style={styles.headerAvatar} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Título del formulario */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {titulo ? `Formulario - ${titulo}` : 'Formulario para aplicar a asistencias estudiantiles'}
        </Text>
      </View>

      {/* Sección de datos personales */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
      </View>

      {/* Formulario dividido en dos columnas */}
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <View style={{ flex: 1 }}>
          {/* Campos de nombre, correo, teléfono, promedio, horas */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>1. Nombre</Text>
            <TextInput style={styles.input} value={formulario.nombre} onChangeText={t => handleChange('nombre', t)} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>2. Correo Institucional</Text>
            <TextInput style={styles.input} value={formulario.correo} onChangeText={t => handleChange('correo', t)} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>3. Teléfono</Text>
            <TextInput style={styles.input} value={formulario.telefono} onChangeText={t => handleChange('telefono', t)} keyboardType="phone-pad" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>4. Promedio en el último semestre cursado</Text>
            <TextInput style={styles.input} onChangeText={t => handleChange('promedio', t)} keyboardType="decimal-pad" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>5. Cantidad de horas a la semana</Text>
            <TextInput style={styles.input} onChangeText={t => handleChange('horas', t)} keyboardType="numeric" />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {/* Campos de nota, comentarios y carga de documento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>6. Nota con la cual aprobó el curso</Text>
            <TextInput style={styles.input} onChangeText={t => handleChange('nota', t)} keyboardType="decimal-pad" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>7. Comentarios adicionales</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              multiline
              numberOfLines={4}
              onChangeText={t => handleChange('comentarios', t)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Documentos adicionales</Text>
            <TouchableOpacity onPress={seleccionarDocumento}>
              <View style={styles.documentUploadBox}>
                <Text style={styles.uploadPlaceholder}>
                  {documento ? documento.name : '[Tocar para seleccionar]'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Botón para enviar la solicitud */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={aplicar}>
          <Text style={styles.buttonText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FormularioAplicacion;
