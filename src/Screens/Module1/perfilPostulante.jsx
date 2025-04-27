import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, Avatar } from 'react-native-paper';
import { styles } from '../../Style/Module1/perfilPostulante';
import { useRoute } from '@react-navigation/native';
import URL from '../../Services/url';
import axios from 'axios';
import { useState } from 'react';



// 🔹 Historial de ofertas
const historialOfertas = [
  {
    titulo: "Tuto mate",
    fecha: "Apr 15, 2025",
    horas: "40 horas/semana"
  }
];

export default function PerfilEstudiante() {
  const [datosEstudiante, setDatosEstudiante] = useState({});
  const [historialOfertas, setHistorialOfertas] = useState([]); // si en algún momento también lo traés
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleInformacion();
      console.log('Datos del estudiante:', data); // Debug
      if (data && data.estudiante) {
        setDatosEstudiante(data.estudiante);
        setHistorialOfertas(data.historialAsistencia); // Si también traes el historial de ofertas
      }
    };
  
    fetchData();
  }, []);
  

  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/perfilEstudiantes`, {
        params: { userId }
      });

      const data = response.data;
      if (response.status === 200) {
        return data;
      } else {
        console.error('Error al obtener los datos:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return [];
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Perfil del estudiante</Text>
  
      <View style={styles.contenido}>
        {/* Información del estudiante */}
        <View style={styles.card}>
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
          <Text style={styles.seccionTitulo}>Mis Datos</Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Correo: </Text>
            {datosEstudiante.correo}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Nombre: </Text>
            {datosEstudiante.nombre}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Carrera: </Text>
            {datosEstudiante.carrera}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Ponderado: </Text>
            {datosEstudiante.ponderado}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Cursos aprobados: </Text>
            {datosEstudiante.cursosAprobados}
          </Text>
        </View>
  
        <View style={styles.card}>
          <Text style={styles.seccionTitulo}>Historial de ofertas</Text>
          {historialOfertas.length > 0 ? (
            historialOfertas.map((oferta, index) => (
              <Card key={index} style={styles.oferta}>
                <Card.Title
                  titleNumberOfLines={3}
                  subtitleNumberOfLines={1}
                  titleStyle={{ flexWrap: 'wrap' }}
                  subtitleStyle={{ flexWrap: 'wrap' }}
                  title={oferta.titulo}
                  subtitle={oferta.fecha}
                />
                <Card.Content>
                  <Text style={[styles.chip, { flexWrap: 'wrap' }]}>{oferta.horas} horas</Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.dato}>No hay ofertas registradas.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}