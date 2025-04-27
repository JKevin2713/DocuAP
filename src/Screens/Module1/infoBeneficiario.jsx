//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Pantalla de visualización de perfil de un estudiante, incluyendo:
// - Información personal (correo, nombre, carrera, ponderado, cursos aprobados)
// - Historial de ofertas donde ha participado
//---------------------------------------------------------------------------------------------------------------

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, Avatar } from 'react-native-paper';
import { styles } from '../../Style/Module1/infoBeneficiario.js'; // Estilos personalizados

//---------------------------------------------------------------------------------------------------------------
// 🔹 Datos simulados del estudiante (En implementación real se reemplazaría con datos obtenidos de la API)
//---------------------------------------------------------------------------------------------------------------
const datosEstudiante = {
  correo: "sanchaves@estudiantec.cr",
  cedula: "110050500",
  nombre: "Santiago Chaves Garbanzo",
  carrera: "Ingeniería en Computación",
  ponderado: 80.9,
  cursosAprobados: 30,
};

//---------------------------------------------------------------------------------------------------------------
// 🔹 Historial simulado de ofertas participadas (En implementación real se cargaría dinámicamente)
//---------------------------------------------------------------------------------------------------------------
const historialOfertas = [
  {
    titulo: "Tuto mate",
    fecha: "Apr 15, 2025",
    horas: "40 horas/semana"
  }
];

//---------------------------------------------------------------------------------------------------------------
// Componente principal - PerfilEstudiante
//---------------------------------------------------------------------------------------------------------------
export default function PerfilEstudiante() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Título principal */}
      <Text style={styles.titulo}>Perfil del estudiante</Text>

      <View style={styles.contenido}>
        
        {/* Sección de datos personales */}
        <View style={styles.card}>
          <Avatar.Icon size={100} icon="account" style={styles.avatar} /> {/* Avatar del usuario */}
          <Text style={styles.seccionTitulo}>Mis Datos</Text>

          {/* Mostrar los datos del estudiante */}
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Correo: </Text>{datosEstudiante.correo}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Cédula: </Text>{datosEstudiante.cedula}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Nombre: </Text>{datosEstudiante.nombre}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Carrera: </Text>{datosEstudiante.carrera}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Ponderado: </Text>{datosEstudiante.ponderado}
          </Text>
          <Text style={styles.dato}>
            <Text style={styles.etiqueta}>Cursos aprobados: </Text>{datosEstudiante.cursosAprobados}
          </Text>
        </View>

        {/* Sección de historial de ofertas */}
        <View style={styles.card}>
          <Text style={styles.seccionTitulo}>Historial de ofertas</Text>

          {/* Mostrar todas las ofertas en las que ha participado */}
          {historialOfertas.map((oferta, index) => (
            <Card key={index} style={styles.oferta}>
              <Card.Title title={oferta.titulo} subtitle={oferta.fecha} />
              <Card.Content>
                <Text style={styles.chip}>{oferta.horas}</Text> {/* Horas asignadas a la oferta */}
              </Card.Content>
            </Card>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}
