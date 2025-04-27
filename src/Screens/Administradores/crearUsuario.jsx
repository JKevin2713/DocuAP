import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../Style/Administradores/crearUsuario';

const CrearUsuario = () => {
  const navigation = useNavigation();

  // Estados para cada campo
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [telefono, setTelefono] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [rol, setRol] = useState('Estudiante');

  const crearUsuario = () => {
    if (!nombre || !correo || !carrera || !telefono || !departamento || !rol) {
      Alert.alert('Faltan datos', 'Por favor complete todos los campos.');
      return;
    }

    console.log('Nuevo usuario creado:', {
      nombre,
      correo,
      carrera,
      telefono,
      departamento,
      rol,
    });

    Alert.alert('Usuario creado', `${nombre} fue registrado como ${rol}.`);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../../assets/LogoTec.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity>
          <Image
            source={require('../../../assets/avataricon.png')}
            style={styles.headerAvatar}
          />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Registro de usuario</Text>
      </View>

      {/* Campos del formulario */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre completo"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          placeholder="Correo electrónico"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Carrera</Text>
        <TextInput
          style={styles.input}
          value={carrera}
          onChangeText={setCarrera}
          placeholder="Carrera del usuario"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          placeholder="Número de teléfono"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Escuela / Departamento</Text>
        <TextInput
          style={styles.input}
          value={departamento}
          onChangeText={setDepartamento}
          placeholder="Nombre del departamento o escuela"
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rol</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={rol}
          onValueChange={(itemValue) => setRol(itemValue)}
        >
          <Picker.Item label="Estudiante" value="Estudiante" />
          <Picker.Item label="Profesor" value="Profesor" />
          <Picker.Item label="Escuela" value="Escuela" />
          <Picker.Item label="Administrador" value="Administrador" />
        </Picker>
      </View>

      {/* Botones estilo 'EditarUsuario' */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={crearUsuario}
        >
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.returnButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CrearUsuario;
