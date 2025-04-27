// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import URL from '../../Services/url';
import { styles } from '../../Style/Profesores/evaluacionRetroalimentacion';

//---------------------------------------------------------------------------------------------------------------
// Componente EvaluacionRetroalimentacion - Pantalla para evaluar y retroalimentar a los estudiantes
//---------------------------------------------------------------------------------------------------------------
// Este componente permite al profesor evaluar y retroalimentar a los estudiantes en función de sus asistencias y desempeños.
const EvaluacionRetroalimentacion = ({ route }) => {

  
  const { userId } = route.params;
  const apiUrl = `${URL}:3000`;

  // Estados para manejar los registros de asistencias y desempeños
  const [asignadas, setAsignadas] = useState([]);
  const [cerradas, setCerradas] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [registro, setRegistro] = useState(null);
  const [newComentario, setNewComentario] = useState('');
  const [newDesempeno, setNewDesempeno] = useState('');


  //---------------------------------------------------------------------------------------------------------------
  // useEffect para cargar los datos de asistencias y desempeños al montar el componente
  //---------------------------------------------------------------------------------------------------------------
  // Se realiza una petición a la API para obtener la información del usuario y se formatean los datos
  useEffect(() => {
    // Función para obtener datos de la API
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          `${apiUrl}/moduloProfesores/getUserInfoByAsistencias/${userId}`
        );
        if (resp.status === 200) {
          const { asignadas, cerradas } = resp.data;
          const formatAsign = asignadas.map(item => ({
            key: `${item.datosAsignacion.userId}-${item.datosAsistencia.tituloPrograma}`.trim().toLowerCase(),
            type: 'asignada',
            asignacionId: item.asignacionId,
            userId: item.datosAsignacion.userId,
            pago: item.datosAsignacion.pago,
            fechaAsignacion: item.datosAsignacion.fechaAsignacion,
            activo: item.datosAsignacion.activo,
            curso: item.datosAsistencia.tituloPrograma,
            semestre: item.datosAsistencia.semestre,
            estado: item.datosAsistencia.estado,
            beneficio: item.datosAsistencia.beneficio,
            horario: item.datosAsistencia.horario,
            requisitosAdicionales: item.datosAsistencia.requisitosAdicionales,
            tituloPrograma: item.datosAsistencia.tituloPrograma,
            descripcion: item.datosAsistencia.descripcion,
            retroalimentacion: item.datosAsignacion.retroalimentacion,
            desempeno: item.datosAsignacion.desempeno
          }));
          const formatCerr = cerradas.map(item => ({
            key: item.asistenciaId.trim().toLowerCase(),
            type: 'cerrada',
            asistenciaId: item.asistenciaId,
            curso: item.datosAsistencia.tituloPrograma,
            tituloPrograma: item.datosAsistencia.tituloPrograma, 
            semestre: item.datosAsistencia.semestre,
            estado: item.datosAsistencia.estado,
            beneficio: item.datosAsistencia.beneficio,
            horario: item.datosAsistencia.horario,
            requisitosAdicionales: item.datosAsistencia.requisitosAdicionales,
            descripcion: item.datosAsistencia.descripcion,
            cantidadVacantes: item.datosAsistencia.cantidadVacantes,
            horaXSemana: item.datosAsistencia.horaXSemana,
            retroalimentacion: item.datosAsistencia.retroalimentacion,
            desempeno: item.datosAsistencia.desempeno
          }));
          const combined = [...formatAsign, ...formatCerr];
          setAsignadas(formatAsign);
          setCerradas(formatCerr);
          setAllRecords(combined);
          setRegistro(combined[0] || null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        Alert.alert('Error', 'No se pudo cargar la información');
      }
    };
    fetchData();
    // espera el userId para cargar los datos
  }, [userId]);

  //---------------------------------------------------------------------------------------------------------------
  // useEffect para filtrar los registros según el título seleccionado
  //---------------------------------------------------------------------------------------------------------------
  // Se filtran los registros de acuerdo al título seleccionado en el Picker
  useEffect(() => {
    let key = selectedKey;
    if (key === "custom" && customKey.trim()) key = customKey.trim().toLowerCase();

    const filtered = key
      ? allRecords.filter(r => r.tituloPrograma === key)
      : allRecords;

    setRegistro(filtered[0] || null);
  }, [selectedKey, customKey, allRecords]);

  const uniqueTitles = Array.from(
    new Set(allRecords.map(r => r.tituloPrograma).filter(titulo => titulo))
  );

  console.log("Todos los títulos en allRecords:", allRecords.map(r => r.tituloPrograma));
  console.log("Títulos únicos para el Picker:", uniqueTitles);

  //---------------------------------------------------------------------------------------------------------------
  // Función para manejar el guardado de la retroalimentación y desempeño
  //---------------------------------------------------------------------------------------------------------------
  // Esta función se encarga de enviar los datos de retroalimentación y desempeño al servidor para guardarlos en la base de datos
  const handleGuardar = async () => {
    if (!registro) {
      return Alert.alert("Error", "Seleccione un registro antes de guardar");
    }

    const id = registro.type === "asignada"
      ? registro.asignacionId
      : registro.asistenciaId;
    const type = registro.type;

    const body = {
      retroalimentacion: newComentario,
      desempeno: newDesempeno
    };

    try {
      const endpoint = `${apiUrl}/moduloProfesores/updateAsistenciaFeedback/${type}/${id}`;
      //console.log("[handleGuardar] PATCH", endpoint);
      //console.log("[handleGuardar] body:", body);

      const response = await axios.patch(endpoint, body);

      //console.log("[handleGuardar] response:", response.status, response.data);
      if (response.status === 200) {
        Alert.alert("Éxito", "Feedback guardado correctamente.");
        setRegistro(r => r
          ? { ...r, retroalimentacion: newComentario, desempeno: body.desempeno }
          : r
        );
        setNewComentario("");
        setNewDesempeno("");
      } else {
        Alert.alert("Error", "No se pudo guardar el feedback.");
      }
    } catch (error) {
      console.error(
        "[handleGuardar] Error updating feedback:",
        error.response?.status,
        error.response?.data || error.message
      );
      Alert.alert("Error", "Error de conexión o servidor.");
    }
  };

  //---------------------------------------------------------------------------------------------------------------
  // Renderizado del componente
  //---------------------------------------------------------------------------------------------------------------
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Historial de Evaluación</Text>
      <ScrollView horizontal style={styles.carouselContainer}>
        {allRecords.map(r => (
          <View key={r.key} style={styles.card}>
            <Text style={styles.cardTitle}>{r.curso}</Text>
            <Text style={styles.cardDetail}>Tipo: {r.type}</Text>
            <Text style={styles.cardDetail}>Semestre: {r.semestre}</Text>
            <Text style={styles.cardDetail}>Estado: {r.estado}</Text>
            {r.type === 'asignada' && (
              <>
                <Text style={styles.cardDetail}>Pago: {r.pago}</Text>
                <Text style={styles.cardDetail}>
                  Fecha Asignación: {new Date(r.fechaAsignacion.seconds * 1000).toISOString().split('T')[0]}
                </Text>
                <Text style={styles.cardDetail}>Activo: {r.activo ? 'Sí' : 'No'}</Text>
                <Text style={styles.cardDetail}>Beneficio: {r.beneficio}</Text>
                <Text style={styles.cardDetail}>Horario: {r.horario}</Text>
                <Text style={styles.cardDetail}>Descripción: {r.descripcion}</Text>
              </>
            )}
            {r.type === 'cerrada' && (
              <>
                <Text style={styles.cardDetail}>Beneficio: {r.beneficio}</Text>
                <Text style={styles.cardDetail}>Horario: {r.horario}</Text>
                <Text style={styles.cardDetail}>Vacantes: {r.cantidadVacantes}</Text>
                <Text style={styles.cardDetail}>Horas/Semana: {r.horaXSemana}</Text>
                <Text style={styles.cardDetail}>Descripción: {r.descripcion}</Text>
              </>
            )}
            <Text style={styles.cardDetail}>Desempeño: {r.desempeno || 'N/A'}</Text>
            <Text style={styles.cardDetail}>Retroalimentación: {r.retroalimentacion || 'Sin comentarios'}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Evaluación y Retroalimentación</Text>
      <Text style={styles.label}>Seleccione registro:</Text>
      <Picker
        selectedValue={selectedKey}
        style={styles.picker}
        onValueChange={setSelectedKey}
      >
        <Picker.Item label="Todos" value="" />
        {uniqueTitles.map((titulo, index) => (
          <Picker.Item key={`${titulo}-${index}`} label={titulo} value={titulo} />
        ))}
        <Picker.Item label="Personalizado" value="custom" />
      </Picker>

      {selectedKey === 'custom' && (
        <TextInput
          style={styles.input}
          placeholder="Escribe key..."
          value={customKey}
          onChangeText={setCustomKey}
        />
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Comentario:</Text>
        <TextInput
          style={styles.input}
          value={newComentario}
          onChangeText={setNewComentario}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Desempeño:</Text>
        <TextInput
          style={styles.input}
          value={newDesempeno}
          onChangeText={setNewDesempeno}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EvaluacionRetroalimentacion;