// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../../Style/Administradores/editarUsuario';
import URL from '../../Services/url';
import axios from 'axios';

//---------------------------------------------------------------------------------------------------------------
// Componente EditarUsuario - Pantalla para editar la información de un usuario
//---------------------------------------------------------------------------------------------------------------
// Este componente permite al administrador editar la información de un usuario específico, como nombre, correo, carrera y teléfono.

const EditarUsuario = () => {
  // Definición de estados y hooks
  const [carreras, setCarreras] = useState([]);
  const [campoSeleccionado, setCampoSeleccionado] = useState('');
  const [nuevoValor, setNuevoValor] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const {
    nombre = '',
    correo = '',
    carrera = '',
    telefono = '',
    departamento = '',
  } = route.params || {};


  //---------------------------------------------------------------------------------------------------------------
  // useEffect para cargar la lista de carreras al montar el componente
  //---------------------------------------------------------------------------------------------------------------
  // Se realiza una llamada a la API para obtener la lista de carreras disponibles y se almacenan en el estado correspondiente.
  //
  useEffect(() => {
    const obtenerCarreras = async () => {
      try {
        const response = await axios.get(`${URL}:3000/admin/carreras`);
        console.log('Carreras obtenidas:', response.data);
        setCarreras(response.data.carreras); 
      } catch (error) {
        console.error('Error al obtener las carreras:', error);
      }
    };
  
    obtenerCarreras();
  }, []);

  //---------------------------------------------------------------------------------------------------------------
  // Función para guardar los cambios realizados en la información del usuario
  //---------------------------------------------------------------------------------------------------------------
  // Esta función se encarga de enviar los datos actualizados del usuario al servidor para su almacenamiento.
  // Se utiliza un endpoint específico para esta acción.
  // Se valida que el campo seleccionado y el nuevo valor no estén vacíos antes de realizar la llamada a la API.
  // Si la llamada es exitosa, se muestra un mensaje de confirmación y se navega de regreso a la pantalla anterior.
  // Si ocurre un error, se muestra un mensaje de error.  
  const guardarCambios = async () => {
    if (!campoSeleccionado || !nuevoValor) {
      alert('Por favor seleccione un campo y escriba un nuevo valor.');
      return;
    }
    try {
      const nombreUsuario = route.params.nombre; // Asegúrate de que el ID del usuario se pasa como parámetro


      console.log('Campo seleccionado:', campoSeleccionado);
      console.log('Nuevo valor:', nuevoValor);
      
      const apiUrl = `${URL}:3000`;
      const response = await axios.put(`${apiUrl}/admin/ActualizarUsuario`, {
        nombreUsuario: nombreUsuario,
        campoSeleccionado: campoSeleccionado,
        nuevoValor: nuevoValor,
      });

    }
    catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar cambios. Por favor, inténtelo de nuevo más tarde.');
      return;
    }
      

    console.log(`Campo actualizado: ${campoSeleccionado} → ${nuevoValor}`);
    alert(`Se actualizó el campo ${campoSeleccionado}`);
    navigation.goBack();
  };

  //---------------------------------------------------------------------------------------------------------------
  // Función para obtener el placeholder del campo editable según el campo seleccionado
  //---------------------------------------------------------------------------------------------------------------
  // Esta función devuelve un texto de placeholder específico para cada campo editable.
  // Se utiliza para guiar al usuario sobre qué tipo de información debe ingresar en el campo correspondiente.
  const obtenerPlaceholder = () => {
    switch (campoSeleccionado) {
      case 'nombre': return 'Nuevo nombre';
      case 'correo': return 'Nuevo correo';
      case 'carrera': return 'Nueva carrera';
      case 'telefono': return 'Nuevo teléfono';
      default: return '';
    }
  };

  //---------------------------------------------------------------------------------------------------------------
  // Renderizado del formulario de edición de usuario
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
        <Text style={styles.headerText}>Editar Usuario</Text>
      </View>

      {/* Datos actuales */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.input}>{nombre}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.input}>{correo}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>carrera:</Text>
        <Text style={styles.input}>{carrera}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.input}>{telefono}</Text>
      </View>

      {/* Selector de campo */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Seleccionar campo a editar</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={campoSeleccionado}
          onValueChange={(itemValue) => {
            setCampoSeleccionado(itemValue);
            setNuevoValor('');
          }}
        >
          <Picker.Item label="Seleccione un campo" value="" />
          <Picker.Item label="Nombre" value="nombre" />
          <Picker.Item label="Correo" value="correo" />
          <Picker.Item label="Carrera" value="carrera" />
          <Picker.Item label="Teléfono" value="telefono" />
        </Picker>
      </View>

      {/* Campo editable para nuevo valor */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nuevo valor:</Text>
        {/* Si el campo seleccionado es "Carrera", mostrar un Picker de carreras */}
        {campoSeleccionado === 'carrera' ? (
          <Picker
            selectedValue={nuevoValor}
            onValueChange={(itemValue) => setNuevoValor(itemValue)}
          >
            <Picker.Item label="Seleccione una carrera" value="" />
            {carreras.map((carrera, index) => (
              <Picker.Item
                key={index}
                label={carrera.carrera}
                value={carrera.id}
              />
            ))}
          </Picker>
        ) : (
          <TextInput
            style={styles.input}
            value={nuevoValor}
            onChangeText={setNuevoValor}
            placeholder={obtenerPlaceholder()}
          />
        )}
      </View>

      {/* Botones */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={guardarCambios}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.returnButton, { marginTop: 10 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditarUsuario;
