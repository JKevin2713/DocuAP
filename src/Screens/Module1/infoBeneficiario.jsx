import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Avatar } from 'react-native-paper';
import { styles } from '../../Style/Module1/infoBeneficiario.js'; // Importa los estilos desde el archivo de estilos

// 🔹 Datos del estudiante
const datosEstudiante = {
  correo: "sanchaves@estudiantec.cr",
  cedula: "110050500",
  nombre: "Santiago Chaves Garbanzo",
  carrera: "Ingeniería en Computación",
  ponderado: 80.9,
  cursosAprobados: 30,
};

// 🔹 Historial de ofertas
const historialOfertas = [
  {
    titulo: "Tuto mate",
    fecha: "Apr 15, 2025",
    horas: "40 horas/semana"
  }
];

export default function PerfilEstudiante() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Perfil del estudiante</Text>

      <View style={styles.contenido}>
        {/* Información del estudiante */}
        <View style={styles.card}>
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
          <Text style={styles.seccionTitulo}>Mis Datos</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Correo: </Text>{datosEstudiante.correo}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Cédula: </Text>{datosEstudiante.cedula}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Nombre: </Text>{datosEstudiante.nombre}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Carrera: </Text>{datosEstudiante.carrera}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Ponderado: </Text>{datosEstudiante.ponderado}</Text>
          <Text style={styles.dato}><Text style={styles.etiqueta}>Cursos aprobados: </Text>{datosEstudiante.cursosAprobados}</Text>
        </View>

        {/* Historial de ofertas */}
        <View style={styles.card}>
          <Text style={styles.seccionTitulo}>Historial de ofertas</Text>
          {historialOfertas.map((oferta, index) => (
            <Card key={index} style={styles.oferta}>
              <Card.Title title={oferta.titulo} subtitle={oferta.fecha} />
              <Card.Content>
                <Text style={styles.chip}>{oferta.horas}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}