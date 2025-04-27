//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente de React Native permite crear una nueva oferta de asistencia o tutoría.
// Incluye formularios para ingresar detalles de la oferta, políticas internas y selección de fechas.
// Se conecta al backend usando Axios para registrar la nueva oferta.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, ScrollView, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Componente para listas desplegables
import DateTimePicker from '@react-native-community/datetimepicker'; // Componente para seleccionar fechas
import { styles } from '../../Style/Module1/crearOferta'; // Estilos personalizados
import { useRoute, useNavigation } from '@react-navigation/native'; // Navegación y rutas
import axios from "axios";
import URL from '../../Services/url'; // URL base del backend

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Pantalla para crear una oferta nueva
//---------------------------------------------------------------------------------------------------------------
export default function CrearOfertaScreen() {
  // Estados para cada campo del formulario
  const [nombreCurso, setNombreCurso] = useState('');
  const [profesor, setProfesor] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [estado, setEstado] = useState('');
  const [estudiantes, setEstudiantes] = useState('');
  const [horas, setHoras] = useState('');
  const [beneficio, setBeneficio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaCierre, setFechaCierre] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [showCierre, setShowCierre] = useState(false);
  const [promedioMinimo, setPromedioMinimo] = useState('');
  const [cursosPrevios, setCursosPrevios] = useState('');
  const [horasMaximas, setHorasMaximas] = useState('');
  const [requisitosAdicionales, setRequisitosAdicionales] = useState('');
  const [listaProfesores, setListaProfesores] = useState([]);

  const navigation = useNavigation(); // Hook de navegación
  const router = useRoute();
  const { userId } = router.params; // Extraer ID de la escuela o departamento

  //-------------------------------------------------------------------------------------------------------------
  // Cargar lista de profesores al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const cargarProfesores = async () => {
      const data = await handleInformacionProfesor();
      setListaProfesores(data);
    };
    cargarProfesores();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener los profesores disponibles
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacionProfesor = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/profesoresEscuela`, { params: { userId } });
      return response.data.profesor;
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error de red o del servidor.");
      return null;
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Funciones para confirmar fechas (inicio y cierre)
  //-------------------------------------------------------------------------------------------------------------
  const handleConfirmInicio = (event, selectedDate) => {
    if (selectedDate) setFechaInicio(selectedDate);
  };

  const handleConfirmCierre = (event, selectedDate) => {
    if (selectedDate) setFechaCierre(selectedDate);
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función para crear una nueva oferta
  //-------------------------------------------------------------------------------------------------------------
  const handleCrearOferta = async () => {
    const data = {  
      id: userId,
      nombreCurso,
      profesor,
      tipo,
      estudiantes,
      horas: horasMaximas,
      beneficio: tipoPago,
      promedio: promedioMinimo,
      cursosPrevios,
      descripcion,
      requisitos: requisitosAdicionales,
      fechaInicio: fechaInicio.toISOString().split('T')[0], // Formato YYYY-MM-DD
      fechaCierre: fechaCierre.toISOString().split('T')[0]
    };

    // Validación de campos obligatorios
    const camposRequeridos = [
      "id", "nombreCurso", "profesor", "tipo", 
      "estudiantes", "horas", "beneficio", "descripcion", 
      "requisitos", "fechaInicio", "fechaCierre"
    ];
    const camposFaltantes = camposRequeridos.filter((campo) => !data[campo]);
    if (camposFaltantes.length > 0) {
      alert(`⚠️ Por favor complete los siguientes campos: ${camposFaltantes.join(", ")}`);
      return;
    }

    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.post(`${apiUrl}/escuelas/publiOferta`, { data });
      console.log("Respuesta del servidor:", response.data);
      alert("Oferta creada exitosamente.");
      navigation.goBack(); // Volver a la pantalla anterior
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error de red o del servidor.");
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado del formulario para crear oferta
  //-------------------------------------------------------------------------------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear nueva oferta</Text>

      {/* Inputs básicos */}
      <Text>Nombre de la oferta</Text>
      <TextInput style={styles.input} value={nombreCurso} onChangeText={setNombreCurso} />

      <Text>Nombre del profesor</Text>
      <Picker
        selectedValue={profesor}
        onValueChange={setProfesor}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un profesor" value="" />
        {listaProfesores.map((prof) => (
          <Picker.Item key={prof.id} label={prof.titulo} value={prof.id} />
        ))}
      </Picker>

      {/* Selección de tipo y beneficio */}
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text>Tipo</Text>
          <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
            <Picker.Item label="Seleccione el tipo" value="" />
            <Picker.Item label="Tutoría" value="tutoria" />
            <Picker.Item label="Asistencia" value="asistencia" />
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text>Tipo de beneficio</Text>
          <Picker selectedValue={tipoPago} onValueChange={setTipoPago} style={styles.picker}>
            <Picker.Item label="Seleccione el pago" value="" />
            <Picker.Item label="Exoneración" value="Exoneracion" />
            <Picker.Item label="Remuneración" value="Remuneracion" />
          </Picker>
        </View>
      </View>

      {/* Inputs adicionales */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text>Número de estudiantes</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={estudiantes} onChangeText={setEstudiantes} />
        </View>
      </View>

      {/* Fecha de inicio y cierre */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text>Fecha de inicio</Text>
          <TouchableOpacity onPress={() => setShowInicio(true)} style={styles.input}>
            <Text>{fechaInicio.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showInicio && (
            <DateTimePicker
              value={fechaInicio}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowInicio(false);
                if (selectedDate) setFechaInicio(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.halfInput}>
          <Text>Fecha de cierre</Text>
          <TouchableOpacity onPress={() => setShowCierre(true)} style={styles.input}>
            <Text>{fechaCierre.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showCierre && (
            <DateTimePicker
              value={fechaCierre}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowCierre(false);
                if (selectedDate) setFechaCierre(selectedDate);
              }}
            />
          )}
        </View>
      </View>

      {/* Políticas internas */}
      <Text style={styles.title}>Políticas internas</Text>

      <Text>Promedio mínimo requerido</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={promedioMinimo} onChangeText={setPromedioMinimo} />

      <Text>Cursos previos aprobados y notas</Text>
      <TextInput style={[styles.input, { height: 80 }]} multiline value={cursosPrevios} onChangeText={setCursosPrevios} />

      <Text>Horas máximas por semestre</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={horasMaximas} onChangeText={setHorasMaximas} />

      <Text>Requisitos adicionales</Text>
      <TextInput style={[styles.input, { height: 80 }]} multiline value={requisitosAdicionales} onChangeText={setRequisitosAdicionales} />

      <Text>Descripción</Text>
      <TextInput style={[styles.input, { height: 80 }]} multiline value={descripcion} onChangeText={setDescripcion} />

      {/* Botón de enviar */}
      <TouchableOpacity style={styles.button} onPress={handleCrearOferta}>
        <Text style={styles.buttonText}>Crear oferta</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};
