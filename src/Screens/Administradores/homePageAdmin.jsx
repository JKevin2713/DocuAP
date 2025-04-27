
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../Style/Administradores/homePageAdmin';

const HomePageAdmin = () => {
  const navigation = useNavigation();

  const options = [
    "Gestión de Usuarios y Roles",
    "Monitoreo de actividades",
    "Validación de ofertas publicadas"
  ];

  const screenMapping = {
    "Gestión de Usuarios y Roles": "GestionRolesUsuarios",
    "Monitoreo de actividades": "MonitoreoActividades",
    "Validación de ofertas publicadas": "ValidacionOfertas"
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header institucional */}
      <View style={styles.headerBar}>
        <Image
          source={require('../../../assets/LogoTec.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate('perfilAdmin')}>
          <Image
            source={require('../../../assets/avataricon.png')}
            style={styles.headerAvatar}
          />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.title}>Menú de Administradores</Text>

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        {options.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => {
              const route = screenMapping[label];
              if (route) {
                navigation.navigate(route);
              } else {
                alert(`Ruta no definida para: ${label}`);
              }
            }}
          >
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón de salir */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 40, backgroundColor: '#405F90' }]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>Salir</Text>
      </TouchableOpacity>

      {/* Imagen decorativa */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/Login/ImagenLogin.png')}
          style={styles.image}
        />
      </View>
    </ScrollView>
  );
};

export default HomePageAdmin;
