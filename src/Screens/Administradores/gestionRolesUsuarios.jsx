import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../Style/Administradores/gestionRolesUsuarios';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import URL from '../../Services/url';



const GestionUsuariosRoles = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const route = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      const datos = await handleInformacionUsuarios();
      if (datos && datos.datos) {
        setUsuarios(datos.datos);
        setFiltrados(datos.datos); // Mostrar todos al inicio
      }
    };
    fetchData();
  }, []);

  const handleInformacionUsuarios = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/admin/obtenerDatosUsuarios`);
      console.log(response.data.datos);
      return response.data;
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error de red o del servidor.");
      return null;
    }
  };

  const handleEliminarUsuarios = async (idUsuario) => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.delete(`${apiUrl}/admin/EliminarUsuario`, {
        params: { id: idUsuario},
      });
      if(response.status === 200){
        Alert.alert("Usuario eliminado", "El usuario ha sido eliminado correctamente.");
        // Actualizar la lista de usuarios después de eliminar
        const datos = await handleInformacionUsuarios();
        if (datos && datos.datos) {
          setUsuarios(datos.datos);
          setFiltrados(datos.datos); // Mostrar todos al inicio
        }
      }
      
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error de red o del servidor.");
      return null;
    }
  };

  const realizarBusqueda = () => {
    const texto = busqueda.toLowerCase();
    const resultado = usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.rol.toLowerCase().includes(texto)
    );
    setFiltrados(resultado);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Nombre */}
      <View style={styles.cardRow}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{item.nombre}</Text>
      </View>

      {/* Rol */}
      <View style={styles.cardRow}>
        <Text style={styles.label}>Rol:</Text>
        <Text style={styles.value}>{item.rol}</Text>
      </View>

      {/* Correo */}
      <View style={styles.cardRow}>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.value}>{item.correo}</Text>
      </View>

      {/* Carrera */}
      <View style={styles.cardRow}>
        <Text style={styles.label}>Carrera:</Text>
        <Text style={styles.value}>{item.carrera}</Text>
      </View>

      {/* Teléfono */}
      <View style={styles.cardRow}>
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{item.telefono}</Text>
      </View>

      {/* Sede */}
      <View style={styles.cardRow}>
        <Text style={styles.label}>Sede:</Text>
        <Text style={styles.value}>{item.sede}</Text>
      </View>

      {/* Botones */}
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('CambioRol', { nombre: item.nombre, rol: item.rol, id: item.id })
          }
        >
          <Text style={styles.actionButtonText}>Cambiar Rol</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('EditarUsuario', {
              nombre: item.nombre,
              correo: item.correo,
              carrera: item.carrera,
              telefono: item.telefono,
              departamento: item.carrera, // Adaptamos departamento desde carrera
              rol: item.rol,
            })
          }
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert(
              'Confirmar eliminación',
              `¿Deseas eliminar al usuario ${item.nombre}?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', onPress: () => handleEliminarUsuarios(item.id)},
              ]
            )
          }
        >
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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

      <Text style={styles.header}>Gestión de usuarios y roles</Text>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o rol"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity onPress={realizarBusqueda} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de usuarios */}
      <FlatList
        data={filtrados}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Botones finales */}
      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('HomePageAdmin')}
        >
          <Text style={styles.actionButtonText}>Salir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CrearUsuario')}
        >
          <Text style={styles.actionButtonText}>Crear nuevo usuario</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GestionUsuariosRoles;
