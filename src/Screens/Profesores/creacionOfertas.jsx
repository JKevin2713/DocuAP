// Importaciones necesarias
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../../Style/Profesores/creacionOfertas';
import axios from 'axios';
import URL from '../../Services/url';

// ---------------------------------------------------------------------------------------------------------------
// Componente principal - Pantalla de Creación de Ofertas
// ---------------------------------------------------------------------------------------------------------------
// Este componente permite a los profesores crear nuevas ofertas de programas, ingresando información relevante
const CreacionOfertas = () => {
  // Se obtienen las funciones de navegación y la ruta actual
  // Se utiliza useNavigation para navegar entre pantallas y useRoute para obtener parámetros de la ruta actual
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, contactInfo } = route.params;

  // Se definen los estados para almacenar la información del formulario
  const [nombrePrograma, setNombrePrograma] = useState('');
  const [objetivos, setObjetivos] = useState('');
  const [tipo, setTipo] = useState('');
  const [horario, setHorario] = useState('');
  const [vacantes, setVacantes] = useState('');
  const [horasSemanal, setHorasSemanal] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');
  const [beneficios, setBeneficios] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [semestre, setSemestre] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [promedioRequerido, setPromedioRequerido] = useState('');
  const [totalHoras, setTotalHoras] = useState('');
  const [requisitosAdicionales, setRequisitosAdicionales] = useState('');

  // ----------------------------------------------------------------------------------------------------------------
  // Función para manejar la creación de la oferta
  // ----------------------------------------------------------------------------------------------------------------
  // Esta función valida los campos del formulario y envía la información a la API para crear una nueva oferta
  const handleCrearOferta = async () => {
    if (
      !nombrePrograma.trim() ||
      !objetivos.trim() ||
      !tipo.trim() ||
      !horario.trim() ||
      !vacantes.trim() ||
      !horasSemanal.trim() ||
      !fechaInicio.trim() ||
      !fechaCierre.trim() ||
      !beneficios.trim() ||
      !descripcion.trim() ||
      !requisitos.trim() ||
      !semestre.trim()
    ) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    // Validación de campos numéricos
    const horasSemanalNum = parseInt(horasSemanal, 10);
    if (isNaN(horasSemanalNum) || horasSemanalNum <= 0) {
      Alert.alert('Error', 'Las horas por semana deben ser un número positivo.');
      return;
    }
    // Validación de vacantes
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fechaInicio) || !dateRegex.test(fechaCierre)) {
      Alert.alert('Error', 'Las fechas deben estar en el formato AAAA-MM-DD.');
      return;
    }
    // Validación de fechas
    if (new Date(fechaInicio) > new Date(fechaCierre)) {
      Alert.alert('Error', 'La fecha de inicio no puede ser posterior a la fecha de cierre.');
      return;
    }
    // construcción del objeto de datos a enviar
    const body = {
      nombrePrograma,
      objetivos,
      tipo,
      horario,
      vacantes,
      horasSemanal: horasSemanalNum,
      fechaInicio,
      fechaCierre,
      beneficios,
      descripcion,
      requisitos: requisitos, 
      semestre,
      departamento: contactInfo.carrera,
      promedioRequerido,
      totalHoras,
      requisitosAdicionales,
      estado: 'Abierto',
  };

  // Envío de la solicitud a la API
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.post(
        `${apiUrl}/moduloProfesores/insertNewOferta/${userId}`,
        body
      );
      if (response.status === 200) {
        Alert.alert('Éxito', 'Oferta creada exitosamente.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Hubo un problema al crear la oferta. Intente de nuevo.');
      }
    } catch (error) {
      console.error('Error al crear la oferta:', error);
      Alert.alert('Error', 'Hubo un problema al crear la oferta. Intente de nuevo.');
    }
  };

  // ----------------------------------------------------------------------------------------------------------------
  // Función para manejar el regreso a la pantalla anterior
  // ----------------------------------------------------------------------------------------------------------------
  // Esta función utiliza la navegación para regresar a la pantalla anterior
  const handleRegresar = () => navigation.goBack();

  // ----------------------------------------------------------------------------------------------------------------
  // Renderizado del componente
  // ----------------------------------------------------------------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Crear Nueva Oferta</Text>
      <View style={styles.formContainer}>
        {/** Nombre del programa */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del programa</Text>
          <TextInput style={styles.input} placeholder="Ingrese el nombre del programa" value={nombrePrograma} onChangeText={setNombrePrograma} />
        </View>
        {/** Objetivos */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Objetivos del programa</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Ingrese los objetivos" multiline value={objetivos} onChangeText={setObjetivos} />
        </View>
        {/** Tipo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo</Text>
          <TextInput style={styles.input} placeholder="Ingrese el tipo" value={tipo} onChangeText={setTipo} />
        </View>
        {/** Horario */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Horario</Text>
          <TextInput style={styles.input} placeholder="Ingrese el horario" value={horario} onChangeText={setHorario} />
        </View>
        {/** Vacantes */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vacantes</Text>
          <TextInput style={styles.input} placeholder="Ingrese el número de vacantes" keyboardType="numeric" value={vacantes} onChangeText={setVacantes} />
        </View>
        {/** Horas por semana */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Horas por semana</Text>
          <TextInput style={styles.input} placeholder="Ingrese las horas por semana" keyboardType="numeric" value={horasSemanal} onChangeText={setHorasSemanal} />
        </View>
        {/** Fecha de inicio */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha de inicio</Text>
          <TextInput style={styles.input} placeholder="AAAA-MM-DD" value={fechaInicio} onChangeText={setFechaInicio} />
        </View>
        {/** Fecha de cierre */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha de cierre</Text>
          <TextInput style={styles.input} placeholder="AAAA-MM-DD" value={fechaCierre} onChangeText={setFechaCierre} />
        </View>
        {/** Beneficios */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Beneficios</Text>
          <TextInput style={styles.input} placeholder="Ingrese beneficios" value={beneficios} onChangeText={setBeneficios} />
        </View>
        {/** Descripción */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Ingrese descripción" multiline value={descripcion} onChangeText={setDescripcion} />
        </View>
        {/** Semestre */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Semestre</Text>
          <TextInput style={styles.input} placeholder="Ingrese semestre" value={semestre} onChangeText={setSemestre} />
        </View>
      <View style={styles.formGroup}>
          <Text style={styles.label}>Promedio Requerido</Text>
          <TextInput style={styles.input} placeholder="Ingrese promedio requerido" keyboardType="numeric" value={promedioRequerido} onChangeText={setPromedioRequerido} />
      </View>

      <View style={styles.formGroup}>
          <Text style={styles.label}>Total de Horas</Text>
          <TextInput style={styles.input} placeholder="Ingrese total de horas" keyboardType="numeric" value={totalHoras} onChangeText={setTotalHoras} />
      </View>

      <View style={styles.formGroup}>
          <Text style={styles.label}>Requisitos Adicionales</Text>
          <TextInput style={styles.input} placeholder="Ingrese requisitos adicionales" value={requisitosAdicionales} onChangeText={setRequisitosAdicionales} />
      </View>

      <View style={styles.formGroup}>
          <Text style={styles.label}>Requisitos (separar por comas)</Text>
          <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Ej: Conocimiento en Python, Certificación Scrum"
              value={requisitos} 
              onChangeText={setRequisitos} 
          />
      </View>
      </View>
     
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCrearOferta}>
          <Text style={styles.buttonText}>Crear oferta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.regresarButton]} onPress={handleRegresar}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreacionOfertas;
