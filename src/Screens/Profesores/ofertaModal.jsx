import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { modalStyles } from '../../Style/Profesores/ofertaModal';	

const OfertaModal = ({ visible, oferta, contactInfo, onClose }) => {
  if (!oferta) return null;
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <ScrollView style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>{oferta.nombre}</Text>
            <Text style={modalStyles.modalText}>Estudiantes: {oferta.estudiantes}</Text>
            <Text style={modalStyles.modalText}>Profesor: {contactInfo.nombre}</Text>
            <Text style={modalStyles.modalText}>Semestre: {oferta.semestre}</Text>
            <Text style={modalStyles.modalText}>Beneficio: {oferta.beneficio}</Text>
            <Text style={modalStyles.modalText}>Descripción: {oferta.descripcion}</Text>
            <Text style={modalStyles.modalText}>Objetivos: {oferta.objetivos || "No establecido"}</Text>
            <Text style={modalStyles.modalText}>Horario: {oferta.horario || "No establecido"}</Text>
            <Text style={modalStyles.modalText}>Vacantes: {oferta.vacantes || "No establecido"}</Text>
            <Text style={modalStyles.modalText}>Horas por semana: {oferta.horasSemanal || "No establecido"}</Text>
            <Text style={modalStyles.modalText}>Fecha de inicio: {oferta.fechaInicio || "No establecida"}</Text>
            <Text style={modalStyles.modalText}>Fecha de cierre: {oferta.fechaCierre || "No establecida"}</Text>
            <Text style={modalStyles.modalText}>Requisitos: {oferta.requisitos || "No establecidos"}</Text>
          </ScrollView>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OfertaModal;