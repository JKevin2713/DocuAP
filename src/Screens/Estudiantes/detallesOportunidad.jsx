//---------------------------------------------------------------------------------------------------------------

// Detalle de cada solicitud mejor explicada -  funcion que va al tocar el boton de detalles de cada solicitud 
// en la pantalla de busquedaApliOportunidades

//----------------------------------------------------------------------------------------------------------------

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../../Style/Estudiantes/detallesOportunidad';

//--------------------------------------
// Componente principal
//--------------------------------------

const DetalleOportunidad = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Todos los datos que vienen desde búsqueda
  const {
    titulo,
    escuela,
    encargado,
    horas,
    descripcion,
    horario,
    cantidadVacantes,
    cantidadSolicitudes,
    estado,
    promedioRequerido,
    requisitos,
    fechaInicio,
    fechaFin,
    objetivos,
    beneficio,
    tipo,
    semestre,
    totalHoras
  } = route.params;
  
//--------------------------------------
// Renderización de la pantalla principal
//--------------------------------------

  return (
    <ScrollView style={styles.container}>
      {/* Header con logo y perfil */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../assets/LogoTec.png')} style={styles.headerLogo} resizeMode="contain" />
        </TouchableOpacity>
        <Image source={require('../../../assets/avataricon.png')} style={styles.headerAvatar} />
      </View>

      <Text style={styles.title}>Detalle de la Oportunidad</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{titulo}</Text>
        <Text style={styles.cardText}>Tipo: {tipo}</Text>
        <Text style={styles.cardText}>Escuela / Departamento: {escuela}</Text>
        <Text style={styles.cardText}>Encargado: {encargado}</Text>
        <Text style={styles.cardText}>Descripción: {descripcion}</Text>
        <Text style={styles.cardText}>Horario: {horario}</Text>
        <Text style={styles.cardText}>Vacantes: {cantidadVacantes}</Text>
        <Text style={styles.cardText}>Horas por semana: {horas}</Text>
        <Text style={styles.cardText}>Objetivos: {objetivos}</Text>
        <Text style={styles.cardText}>Beneficio: {beneficio}</Text>
        <Text style={styles.cardText}>Estado de la oportunidad: {estado}</Text>
        <Text style={styles.cardText}>Promedio requerido: {promedioRequerido}</Text>
        <Text style={styles.cardText}>Requisitos: {requisitos}</Text>
        <Text style={styles.cardText}>Semestre: {semestre}</Text>
        <Text style={styles.cardText}>Fecha de inicio: {fechaInicio}</Text>
        <Text style={styles.cardText}>Fecha de finalización: {fechaFin}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.applyButton]}
        onPress={() => navigation.navigate('formularioAplicacion', { titulo })}
      >
        <Text style={styles.buttonText}>Aplicar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetalleOportunidad;
