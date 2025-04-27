import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../../Style/Profesores/edicionOfertas";
import OfertaModal from "./ofertaModal";
import axios from "axios";
import URL from "../../Services/url";
import { useNavigation, useRoute } from "@react-navigation/native";

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  if (typeof timestamp === "object" && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString().substring(0, 10);
  }
  return timestamp;
};

const EdicionOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [selectedOfertaId, setSelectedOfertaId] = useState("");
  const [currentOferta, setCurrentOferta] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOferta, setModalOferta] = useState(null);
  const [departamento, setDepartamento] = useState('');
  const [promedioRequerido, setPromedioRequerido] = useState('');
  const [totalHoras, setTotalHoras] = useState('');
  const [requisitosAdicionales, setRequisitosAdicionales] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { userId, contactInfo } = route.params;


  const validarCampos = () => {
    const {
      tituloPrograma,
      beneficio,
      descripcion,
      objetivos,
      tipo,
      horario,
      cantidadVacantes,
      semestre,
      horaXSemana,
      fechaInicio,
      fechaCierre,
    } = currentOferta;
  
    if (!tituloPrograma || !beneficio || !descripcion || !objetivos || !tipo || !horario || !semestre) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios.");
      return false;
    }
  
    if (!cantidadVacantes || isNaN(cantidadVacantes) || parseInt(cantidadVacantes) <= 0) {
      Alert.alert("Error", "La cantidad de vacantes debe ser un número mayor que cero.");
      return false;
    }
  
    if (!horaXSemana || isNaN(horaXSemana) || parseInt(horaXSemana) <= 0) {
      Alert.alert("Error", "Las horas por semana deben ser un número mayor que cero.");
      return false;
    }
  
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaInicio || !fechaRegex.test(fechaInicio)) {
      Alert.alert("Error", "La fecha de inicio debe tener el formato AAAA-MM-DD.");
      return false;
    }
  
    if (!fechaCierre || !fechaRegex.test(fechaCierre)) {
      Alert.alert("Error", "La fecha de cierre debe tener el formato AAAA-MM-DD.");
      return false;
    }
  
    if (new Date(fechaInicio) >= new Date(fechaCierre)) {
      Alert.alert("Error", "La fecha de inicio debe ser anterior a la fecha de cierre.");
      return false;
    }
    if (typeof currentOferta.requisitos !== 'string') {
      Alert.alert("Error", "Formato inválido en requisitos");
      return false;
    }
    if (!departamento.trim()) {
      Alert.alert("Error", "El departamento es requerido.");
      return false;
    }

    if (!promedioRequerido || isNaN(promedioRequerido) || parseFloat(promedioRequerido) < 0) {
      Alert.alert("Error", "Promedio requerido debe ser un número válido.");
      return false;
    }

    if (!totalHoras || isNaN(totalHoras) || parseInt(totalHoras) <= 0) {
      Alert.alert("Error", "Total de horas debe ser un número positivo.");
      return false;
    }

    return true;
  };

  
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const apiUrl = `${URL}:3000`;
        const response = await axios.get(`${apiUrl}/moduloProfesores/getAsistenciasByProfesor/${userId}`);
        if (response.status === 200) {
          setOfertas(response.data.map(oferta => ({
            ...oferta,
            id: oferta.asistenciaId, 
            requisitos: Array.isArray(oferta.requisitos) 
            ? oferta.requisitos.join(', ') 
            : oferta.requisitos || '',
            departamento: oferta.departamento || '',
            promedioRequerido: oferta.promedioRequerido || '',
            totalHoras: oferta.totalHoras?.toString() || '',
            requisitosAdicionales: oferta.requisitosAdicionales || ''
          }))
          );
        } else {
          console.error("Error al obtener las ofertas:", response.statusText);
          Alert.alert("Error", "No se pudieron cargar las ofertas.");
        }
      } catch (error) {
        console.error("Error al obtener las ofertas:", error.message);
        Alert.alert("Error", "No se pudieron cargar las ofertas.");
      }
    };
    fetchOfertas();
  }, [userId]);

  const handlePickerChange = (id) => {
    const oferta = ofertas.find((o) => o.asistenciaId.toString() === id.toString());
    setCurrentOferta(oferta);
  };

 const handleVerMas = (oferta) => {
    const formattedOferta = {
      ...oferta,
      fechaInicio:
        typeof oferta.fechaInicio === "object" && oferta.fechaInicio.seconds
          ? formatDate(oferta.fechaInicio)
          : oferta.fechaInicio,
      fechaCierre:
        typeof oferta.fechaCierre === "object" && oferta.fechaCierre.seconds
          ? formatDate(oferta.fechaCierre)
          : oferta.fechaCierre,
    };
    setModalOferta(formattedOferta);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const ofertaId = currentOferta.id; 
      const apiUrl = `${URL}:3000`;
      const response = await axios.delete(`${apiUrl}/moduloProfesores/deleteOferta/${ofertaId}`);

      if (response.status === 200) {
        Alert.alert("Éxito", "Oferta eliminada exitosamente.");
        setOfertas((prevOfertas) => prevOfertas.filter((oferta) => oferta.id !== ofertaId));
        setCurrentOferta(null);
        setSelectedOfertaId("");
      }else {
      Alert.alert("Error", "Hubo un problema al eliminar la oferta.");
    }
    }catch (error) {
      console.error("Error al eliminar la oferta:", error.message);
      Alert.alert("Error", "Error al eliminar la oferta.");
    }

  };
  
  const handleClose = async () => {
    try {
      const ofertaId = currentOferta.asistenciaId;
      console.log("ID de la oferta a cerrar:", ofertaId); 
      const apiUrl = `${URL}:3000`;
      const response = await axios.patch(`${apiUrl}/moduloProfesores/closeOferta/${ofertaId}`);

      if (response.status === 200) {
        Alert.alert("Éxito", "Oferta cerrada exitosamente.");
        setOfertas((prevOfertas) => prevOfertas.filter((oferta) => oferta.id !== ofertaId));
        setCurrentOferta(null);
        setSelectedOfertaId("");
      }
      else {
        Alert.alert("Error", "Hubo un problema al cerrar la oferta.");
      }
    }catch (error) {
      console.error("Error al cerrar la oferta:", error.message);
      Alert.alert("Error", "Error al cerrar la oferta.");
    }
  };

  const handleGuardarCambios = async () => {
    if (!validarCampos()) return;

    const formatDateToDB = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    };

    const body = {
      tituloPrograma: currentOferta.tituloPrograma,
      beneficio: currentOferta.beneficio,
      descripcion: currentOferta.descripcion,
      objetivos: currentOferta.objetivos,
      tipo: currentOferta.tipo,
      horario: currentOferta.horario,
      cantidadVacantes: currentOferta.cantidadVacantes.toString(),
      semestre: currentOferta.semestre,
      horaXSemana: currentOferta.horaXSemana.toString(),
      fechaInicio: formatDateToDB(currentOferta.fechaInicio),
      fechaCierre: formatDateToDB(currentOferta.fechaCierre),
      requisitos: currentOferta.requisitos 
      ? currentOferta.requisitos.split(',').map(item => item.trim()) 
      : [],
      departamento: currentOferta.departamento,
      promedioRequerido: currentOferta.promedioRequerido,
      totalHoras: currentOferta.totalHoras,
      requisitosAdicionales: currentOferta.requisitosAdicionales
    };

    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.patch(`${apiUrl}/moduloProfesores/updateOferta/${currentOferta.id}`, body);
  
      if (response.status === 200) {
        Alert.alert("Éxito", "Oferta actualizada exitosamente.");
      } else {
        Alert.alert("Error", "Hubo un problema al actualizar la oferta.");
      }
    } catch (error) {
      console.error("Error al actualizar la oferta:", error.message);
      Alert.alert("Error", "Error al actualizar la oferta.");
    }
  };
  
  const handleRegresar = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Carrusel de Ofertas */}
      <Text style={styles.header}>Ofertas Disponibles</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carouselContainer}
      >
        {ofertas
          .filter((oferta) => oferta.estado?.toLowerCase().trim() !== "cerrado")
          .map((oferta, index) => (

          <View key={oferta.asistenciaId} style={styles.card}>
            <Text style={styles.cardTitle}>{oferta.tituloPrograma}</Text>
            <Text style={styles.cardDetail}>Solicitudes: {oferta.cantidadSolicitudes}</Text>
            <Text style={styles.cardDetail}>Profesor: {contactInfo.nombre}</Text>
            <Text style={styles.cardDetail}>Estado: {oferta.estado}</Text>
            <Text style={styles.cardDetail}>Beneficio: {oferta.beneficio}</Text>
            <Text style={styles.cardDetail}>Descripción: {oferta.descripcion}</Text>
            <TouchableOpacity 
              style={styles.cardButton} 
              onPress={() => handleVerMas(oferta)}
            >
              <Text style={styles.cardButtonText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal para mostrar la información completa de la oferta */}
      <OfertaModal
        visible={modalVisible}
        oferta={modalOferta}
        contactInfo={contactInfo}
        onClose={() => setModalVisible(false)}
      />

      {/* Picker para elegir la oferta a editar */}
      <Text style={styles.sectionTitle}>Editar Oferta</Text>
      <Picker
        selectedValue={selectedOfertaId}
        style={styles.picker}
        onValueChange={(itemValue) => handlePickerChange(itemValue)}
      >
        <Picker.Item label="Seleccione una oferta" value="" />
        {ofertas
          .filter(oferta => oferta.estado?.toLowerCase().trim() !== "cerrado")
          .map((oferta, index) => (
          <Picker.Item
            key={oferta.asistenciaId}
            label={oferta.tituloPrograma}
            value={oferta.asistenciaId.toString()} 
          />
        ))}
      </Picker>

      {/* Formulario de edición */}
      {currentOferta && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Título del Programa</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.tituloPrograma}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, tituloPrograma: text })
            }
          />

          <Text style={styles.label}>Beneficio</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.beneficio}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, beneficio: text })
            }
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={currentOferta.descripcion}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, descripcion: text })
            }
            multiline
          />

          {/* Campos extra */}
          <Text style={styles.label}>Objetivos</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={currentOferta.objetivos || ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, objetivos: text })
            }
            multiline
            placeholder="Ingrese los objetivos"
          />

          <Text style={styles.label}>Tipo</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.tipo || ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, tipo: text })
            }
            placeholder="Ingrese el tipo"
          />

          <Text style={styles.label}>Horario</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.horario || ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, horario: text })
            }
            placeholder="Ingrese el horario"
          />

          <Text style={styles.label}>Vacantes</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.cantidadVacantes ? currentOferta.cantidadVacantes.toString() : ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, cantidadVacantes: text })
            }
            placeholder="Cantidad de vacantes"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Semestre</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.semestre || ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, semestre: text })
            }
            placeholder="Semestre"
          />

          <Text style={styles.label}>Horas por Semana</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.horaXSemana ? currentOferta.horaXSemana.toString() : ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, horaXSemana: parseInt(text) })
            }
            placeholder="Horas por semana"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Fecha de Inicio</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.fechaInicio ? formatDate(currentOferta.fechaInicio) : ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, fechaInicio: text })
            }
            placeholder="AAAA-MM-DD"
          />

          <Text style={styles.label}>Fecha de Cierre</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.fechaCierre ? formatDate(currentOferta.fechaCierre) : ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, fechaCierre: text })
            }
            placeholder="AAAA-MM-DD"
          />

          <Text style={styles.label}>Requisitos</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={currentOferta.requisitos || ""}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, requisitos: text })
            }
            multiline
            placeholder="Ingrese los requisitos"
          />

          <Text style={styles.label}>Promedio Requerido</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.promedioRequerido}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, promedioRequerido: text })
            }
            keyboardType="numeric"
          />

          <Text style={styles.label}>Total de Horas</Text>
          <TextInput
            style={styles.input}
            value={currentOferta.totalHoras}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, totalHoras: text })
            }
            keyboardType="numeric"
          />

          <Text style={styles.label}>Requisitos Adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={currentOferta.requisitosAdicionales}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, requisitosAdicionales: text })
            }
            multiline
          />

          {/* Modificar campo de requisitos */}
          <Text style={styles.label}>Requisitos (separados por comas)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={currentOferta.requisitos}
            onChangeText={(text) =>
              setCurrentOferta({ ...currentOferta, requisitos: text })
            }
            placeholder="Ej: Conocimiento en Python, Certificación Scrum"
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleGuardarCambios}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleDelete}
            >
              <Text style={styles.cancelButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleRegresar}
            >
              <Text style={styles.cancelButtonText}>Regresar</Text>
            </TouchableOpacity>
          </View>
          
        </View>

      )}
    </ScrollView>
  );
};

export default EdicionOfertas;