// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../../Style/Administradores/cambioRolStyle';
import axios from 'axios';
import URL from '../../Services/url';

//---------------------------------------------------------------------------------------------------------------
// Componente CambioRol - Pantalla para cambiar el rol de un usuario
//---------------------------------------------------------------------------------------------------------------
// Este componente permite al administrador cambiar el rol de un usuario específico.
const CambioRol = () => {
  // Hooks para manejar la navegación y la ruta actual
  const navigation = useNavigation();
  const route = useRoute();
  const { nombre = 'Nombre del usuario', rol = '' , id } = route.params || {};

  // Definición de estados para manejar la información del rol
  const [rolSeleccionado, setRolSeleccionado] = useState(rol);

  //---------------------------------------------------------------------------------------------------------------
// useEffect para cargar la información del rol al montar el componente
//---------------------------------------------------------------------------------------------------------------
  const handleActualizarRol = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.put(`${apiUrl}/admin/ActualizarRol`, {
        idUsuario: id,
        nuevoRol: rolSeleccionado,
      });

      if (response.status === 200) {
        alert("Rol actualizado", "El rol del usuario ha sido actualizado correctamente.");
        navigation.goBack();
      } else {
        alert("Error", "No se pudo actualizar el rol del usuario.");
      }
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
      alert("Error", "Error de red o del servidor.");
    }
  };

  //---------------------------------------------------------------------------------------------------------------
// Renderizado del formulario de cambio de rol
//---------------------------------------------------------------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePageAdmin')}>
          <Image
            source={require('../../../assets/LogoTec.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/avataricon.png')}
            style={styles.headerAvatar}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Cambio de Rol</Text>
      </View>

      {/* Información del Usuario */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre del usuario:</Text>
        <Text style={styles.input}>{nombre}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Rol actual:</Text>
        <Text style={styles.input}>{rol}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Seleccionar nuevo rol</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={rolSeleccionado}
          onValueChange={(itemValue) => setRolSeleccionado(itemValue)}
        >
          <Picker.Item label="Seleccione un rol" value="" />
          <Picker.Item label="Escuela" value="Escuela" />
          <Picker.Item label="Profesor" value="Profesor" />
          <Picker.Item label="Estudiante" value="Estudiante" />
          <Picker.Item label="Administrador" value="Administrador" />
          <Picker.Item label="Departamento" value="Departamento" />
        </Picker>
      </View>

      {/* Botones */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleActualizarRol}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.returnButton, { marginTop: 10 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CambioRol;