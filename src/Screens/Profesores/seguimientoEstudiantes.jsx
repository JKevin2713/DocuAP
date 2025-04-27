import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../Style/Profesores/seguimientoEstudiantes';
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios';
import URL from '../../Services/url';

const SeguimientoEstudiantes = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  
  const [mergedData, setMergedData] = useState([]);
  const [selectedAsistencia, setSelectedAsistencia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `${URL}:3000`;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/moduloProfesores/getUserInfoByAsistencias/${userId}`
        );

        const asistenciasData = response.data.asignadas;

        const userIds = [
          ...new Set(asistenciasData.map(item => item.datosAsignacion.userId))
        ];

        const usersInfo = await Promise.all(
          userIds.map(userId =>
            axios.get(`${apiUrl}/moduloProfesores/infoProfesores/${userId}`)
          )
        );

        const usersMap = usersInfo.reduce((acc, response) => {
          if (response.data && response.data.id) {
            acc[response.data.id] = response.data;
          }
          return acc;
        }, {});

        const combined = asistenciasData.map(asistencia => ({
          ...asistencia,
          userInfo: usersMap[asistencia.datosAsignacion.userId] || {
            nombre: 'Desconocido',
            id: asistencia.datosAsignacion.userId
          }
        }));

        setMergedData(combined);
        setSelectedAsistencia(combined[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Seguimiento de estudiantes</Text>
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAsistencia?.asignacionId}
          onValueChange={(value) => {
            const selected = mergedData.find(item =>
              item.asignacionId === value
            );
            setSelectedAsistencia(selected);
          }}
        >
          {mergedData.map((item) => (
            <Picker.Item
              key={item.asignacionId}
              label={`${item.userInfo.nombre} - ${item.datosAsistencia.tituloPrograma}`}
              value={item.asignacionId}
            />
          ))}
        </Picker>
      </View>

      {selectedAsistencia && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selectedAsistencia.userInfo.nombre}</Text>

          <Text style={styles.cardDetail}>
            Programa: {selectedAsistencia.datosAsistencia.tituloPrograma}
          </Text>
          <Text style={styles.cardDetail}>
            Teléfono: {selectedAsistencia.userInfo.telefono}
          </Text>
          <Text style={styles.cardDetail}>
            Ponderado: {selectedAsistencia.userInfo.ponderado}
          </Text>
          <Text style={styles.cardDetail}>
            Estado: {selectedAsistencia.datosAsistencia.estado}
          </Text>
          <Text style={styles.cardDetail}>
            Desempeño: {selectedAsistencia.datosAsignacion.desempeno}
          </Text>
          <Text style={styles.cardDetail}>
            Retroalimentación: {selectedAsistencia.datosAsignacion.retroalimentacion}
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate("evaluacionDesempeno", { asistenciaId: selectedAsistencia.asignacionId, student: selectedAsistencia.userInfo })}
          >
            <Text style={styles.buttonText}>Evaluar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('editarSeguimiento', { asistenciaId: selectedAsistencia.asignacionId, student: selectedAsistencia.userInfo })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SeguimientoEstudiantes;