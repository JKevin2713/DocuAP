import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { styles } from '../../Style/Profesores/infoEstudiante';
import URL from '../../Services/url';
import { Timestamp } from 'firebase/firestore';

const InfoEstudiante = ({ route, navigation }) => {
  const { student } = route.params;
  const [carreraName, setCarreraName] = useState(student.carrera || "");
  console.log("studente: ",student)

  useEffect(() => {
    const fetchCarrera = async () => {
      try {
        const response = await axios.get(
          `${URL}:3000/moduloProfesores/searchCarreraByuserId/${student.userId}`
        );
        if (response.status === 200 && response.data?.carrera) {
          setCarreraName(response.data.carrera);
          console.log("Carrera: ", carreraName);
        }
      } catch (error) {
        console.error("Error fetching carrera:", error.message);
      }
    };
    fetchCarrera();
  }, [student.userId]);


  const asignarEstudiante = async () => {
    try {
      const datosStudent = {
        ...student,
        pago: student.pago || 0,
        retroalimentacion: student.comentarios || "",
        desempeno: student.nota || 0,
        fechaAsignacion: Timestamp.now(),
      };
      console.log("[asignarEstudiante] datosStudent enviados:", datosStudent);
  
      const endpoint = `${URL}:3000/moduloProfesores/assignAndRemoveSolicitud`;
      const resp = await axios.patch(endpoint, datosStudent);
  
      console.log("[asignarEstudiante] respuesta status:", resp.status, "data:", resp.data);
      if (resp.status === 200) {
        Alert.alert("Éxito", "Estudiante asignado y solicitud eliminada.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "No se pudo asignar el estudiante.");
      }
    } catch (err) {
      console.error("Error asignarEstudiante:", err.response?.status, err.response?.data || err.message);
      Alert.alert("Error", "Ocurrió un problema al asignar.");
    }
  };

  const rechazarPostulacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.patch(
        `${apiUrl}/moduloProfesores/rechazarPostulacion/${student.id}`,
      );
  
      if (response.status === 200) {
        Alert.alert("Postulación rechazada");
        navigation.goBack();
      } else {
        Alert.alert("Error", "No se pudo rechazar la postulación.");
      }
    } catch (error) {
      console.error("Error en rechazarPostulacion:", error);
      Alert.alert("Error", "Ocurrió un problema al rechazar.");
    }
  };
  

  const solicitarReunion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.patch(
        `${apiUrl}/moduloProfesores/setSolicitudReunion/${student.id}`,
        { reunion: true }
      );
      if (response.status === 200) {
        Alert.alert('Reunión solicitada');
      } else {
        Alert.alert('Error', 'No se pudo solicitar la reunión');
      }
    } catch (error) {
      console.error("Error al solicitar reunión:", error);
      Alert.alert('Error', 'Hubo un problema solicitando la reunión');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      {/* Datos del estudiante */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Mis Datos</Text>
        <View style={styles.dataContainer}>
          <Image source={require('../../../assets/avataricon.png')} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>Correo: {student.correo}</Text>
            <Text style={styles.infoText}>Nombre: {student.nombre}</Text>
            <Text style={styles.infoText}>Carrera: {carreraName}</Text>
            <Text style={styles.infoText}>Ponderado: {student.promedio}</Text>
            <Text style={styles.infoText}>Cursos aprobados: {student.cursosAprobados}</Text>
          </View>
        </View>
      </View>

      {/* Documentos adjuntos */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Documentos adjuntos</Text>
        <View style={styles.documentosContainer}>
          <View style={styles.documentCard}>
            <View style={styles.documentDetails}>
              <Text style={styles.documentTitle}>Registro de notas</Text>
              <Text style={styles.documentDate}>Mar 15, 2025</Text>
            </View>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>Descargar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={asignarEstudiante}>
          <Text style={styles.actionButtonText}>Aprobar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={rechazarPostulacion}>
          <Text style={styles.actionButtonText}>Rechazar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.meetingButton]} onPress={solicitarReunion}>
          <Text style={styles.actionButtonText}>Solicitar reunión</Text>
        </TouchableOpacity>
      </View>

      {/* Regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default InfoEstudiante;