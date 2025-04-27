//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Esta pantalla funciona como el menú principal para usuarios con rol de Escuela o Departamento.
// Permite navegar entre módulos: administración de perfil, publicación de ofertas, asignación de estudiantes, 
// gestión de pagos y visualización de estadísticas internas.
//---------------------------------------------------------------------------------------------------------------

import React, { useState } from "react";
import { View, Text, ScrollView, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from '../../Style/Module1/homePageEscuela'; // Estilos personalizados

//---------------------------------------------------------------------------------------------------------------
// Componente principal - HomePageScreen
//---------------------------------------------------------------------------------------------------------------
export default function HomePageScreen() {
  const navigation = useNavigation(); // Hook de navegación
  const route = useRoute(); // Hook para obtener parámetros de la ruta
  const { userId } = route.params; // ID del usuario (escuela/departamento)

  console.log("User ID:", userId); // Debug: verificar que el ID se recibe correctamente

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado principal
  //-------------------------------------------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Logo institucional */}
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/LogoTec.png")} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Sección: Administración de Perfil */}
        <Text style={styles.sectionTitle}>Perfiles de Escuela/Departamento</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("adminPerfilEscuela", { userId })}>
            <Text style={styles.menuItemText}>Registro y edición de perfil institucional</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("infoEscuela", { userId })}>
            <Text style={styles.menuItemText}>Gestión de información de contacto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("cursosEscuela", { userId })}>
            <Text style={styles.menuItemText}>Áreas Académicas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("historialAsistencia", { userId })}>
            <Text style={styles.menuItemText}>Historial de asistencias/tutorías</Text>
          </TouchableOpacity>
        </View>

        {/* Sección: Publicación de Ofertas */}
        <Text style={styles.sectionTitle}>Publicación de Ofertas de Asistencias, Tutorías y Proyectos</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("publiOferta", { userId })}>
            <Text style={styles.menuItemText}>Sistema de publicación de ofertas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("listaOfertas", { userId })}>
            <Text style={styles.menuItemText}>Historial de cambios en la oferta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("historialPostulantes", { userId })}>
            <Text style={styles.menuItemText}>Asignación de Estudiantes a Tutorías</Text>
          </TouchableOpacity>
        </View>

        {/* Sección: Gestión de Postulaciones */}
        <Text style={styles.sectionTitle}>Gestión de Postulaciones de Estudiantes</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("asistenciaTotalHist", { userId })}>
            <Text style={styles.menuItemText}>Visualización de postulantes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("crearPagoEstudiante", { userId })}>
            <Text style={styles.menuItemText}>Gestión de postulaciones</Text>
          </TouchableOpacity>
        </View>

        {/* Sección: Gestión de Proyectos */}
        <Text style={styles.sectionTitle}>Gestión de Proyectos</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("historialPagoAsis", { userId })}>
            <Text style={styles.menuItemText}>Pagos actuales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("historialPagos", { userId })}>
            <Text style={styles.menuItemText}>Historial y reportes</Text>
          </TouchableOpacity>
        </View>

        {/* Sección: Estadísticas resumen */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Cursos activos</Text>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statDescription}>Ver todos los estudiantes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Estudiantes participantes</Text>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statDescription}>Revisar estudiantes</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Número de profesores</Text>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statDescription}>Ver todos los profesores</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Desafíos pendientes</Text>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statDescription}>Administrar desafíos</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
