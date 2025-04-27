// -------------------------------------------------------------------------------------------------------------
// Descripción general:
// Pantalla de perfil individual de un estudiante postulante.
// - Muestra datos personales
// - Muestra historial de asistencias o tutorías relacionadas
// -------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, Avatar } from 'react-native-paper';
import { styles } from '../../Style/Module1/perfilPostulante'; // Estilos personalizados
import { useRoute } from '@react-navigation/native';           // Hook para obtener parámetros
import URL from '../../Services/url';                          // URL base de la API
import axios from 'axios';                                      // Cliente HTTP

// -------------------------------------------------------------------------------------------------------------
// Componente principal - PerfilEstudiante
// -------------------------------------------------------------------------------------------------------------
export default function PerfilEstudiante() {
  
  // Estados principales
  const [datosEstudiante, setDatosEstudiante] = useState({});      // Datos básicos del estudiante
  const [historialOfertas, setHistorialOfertas] = useState([]);     // Historial de ofertas/asistencias
  const route = useRoute();
  const { userId } = route.params;                                 // Obtener el userId pasado por navegación

  // -----------------------------------------------------------------------------------------------------------
  // useEffect para cargar los datos al montar el componente
  // -----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const data = await handleInformacion();
      console.log('Datos del estudiante:', data); // Depuración
      if (data && data.estudiante) {
        setDatosEstudiante(data.estudiante);     // Actualizar datos básicos
        setHistorialOfertas(data.historialAsistencia || []); // Actualizar historial
      }
    };
    fetchData();
  }, []);

  // -----------------------------------------------------------------------------------------------------------
  // Función que consulta la API para obtener los datos del perfil de estudiante
  // -----------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/perfilEstudiantes`, {
        params: { userId }
      });

      if (response.status === 200) {
        return response.data;
      } else {
        console.error('Error al obtener los datos:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return [];
    }
  };

  // -----------------------------------------------------------------------------------------------------------
  // Renderizado principal
  // -----------------------------------------------------------------------------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Título principal */}
      <Text style={styles.titulo}>Perfil del estudiante</Text>

      <View style={styles.contenido}>
        
        {/* Card de información básica */}
        <View style={styles.card}>
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
          <Text style={styles.seccionTitulo}>Mis Datos</Text>

          {/* Campos del estudiante */}
          <Text style={styles.dato}><Text style={styles.etiqueta}>Correo: </Text>{datosEstudiante.correo}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Nombre: </Text>{datosEstudiante.nombre}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Carrera: </Text>{datosEstudiante.carrera}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Ponderado: </Text>{datosEstudiante.ponderado}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Cursos aprobados: </Text>{datosEstudiante.cursosAprobados}</Text>
        </View>

        {/* Card de historial de ofertas */}
        <View style={styles.card}>
          <Text style={styles.seccionTitulo}>Historial de ofertas</Text>

          {/* Listado de historial */}
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
                  <Text style={[styles.chip, { flexWrap: 'wrap' }]}>
                    {oferta.horas} horas
                  </Text>
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
