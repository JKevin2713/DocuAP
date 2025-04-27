import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../Style/Module1/crearPagoEstudiante';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import URL from '../../Services/url';
import axios from 'axios';


export default function CrearBeneficio() {
  const [estudiante, setEstudiante] = useState('');
  const [oferta, setOferta] = useState('');
  const [tipo, setTipo] = useState('');
  const [monto, setMonto] = useState('');
  const [semestre, setSemestre] = useState('');
  const navigation = useNavigation();
  const [ofertas, setOfertas] = useState([]);
  const [estudiantesPostulados, setEstudiantesPostulados] = useState([]);
  const navigator = useNavigation();
  const route = useRoute();
  const { userId } = route.params;


  useEffect(() => {
    const fetchData = async () => {
      const ofertasObtenidas = await handleInformacion();
      setOfertas(ofertasObtenidas);
      setOferta(ofertasObtenidas[0]?.id || '');
    };
    fetchData();
  }, []);

  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/obtenerDatosCrearOferta`, {
        params: { userId }
      });
      const data = response.data;
      console.log('Datos obtenidos:', data.ofertas); // Verifica los datos obtenidos

      if (response.status === 200) {
        return data.ofertas || [];
      } else {
        console.error('Error al obtener los datos:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return [];
    }
  };

  const crearOfertaNuevo = async (beneficio) => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.post(`${apiUrl}/escuelas/crearPagoOferta`, beneficio);
  
      if (response.status === 200) {
        console.log("Beneficio enviado correctamente:", response.data);
        alert("Beneficio creado", "El beneficio ha sido creado correctamente.");
        navigation.goBack();
        // Aquí podrías navegar a otro screen o mostrar una alerta
      } else {
        console.error("Error en la respuesta del servidor:", response.statusText);
      }
    } catch (error) {
      console.error('Error al crear el beneficio:', error);
    }
  };  

  const crearBeneficio = () => {
    const beneficio = {
      estudiante,
      oferta,
      tipo,
      monto,
      semestre,
      userId
    };
    console.log('Beneficio creado:', beneficio);
    crearOfertaNuevo(beneficio);

  };

  const obtenerPostulados = async (ofertaId) => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/estudiantesPostulados`, {
        params: {
          ofertaId
        }
      });
  
      if (response.status === 200) {
        return response.data.estudiantes || [];
      } else {
        console.error('Error al obtener los postulados:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error en la solicitud de postulados:', error);
      return [];
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crear un nuevo beneficiario</Text>


      <Text style={styles.label}>Oferta</Text>
      <Picker
        selectedValue={oferta}
        onValueChange={async (value) => {
          setOferta(value);
          const postulados = await obtenerPostulados(value);
          setEstudiantesPostulados(postulados);
          setEstudiante(postulados[0]?.id || '');
        }}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione la oferta" value="" />
        {ofertas.map((of) => (
          <Picker.Item key={of.id} label={of.titulo} value={of.id} />
        ))}
      </Picker>


      <Text style={styles.label}>Estudiante</Text>
      <Picker
          selectedValue={estudiante}
          onValueChange={(value) => setEstudiante(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione el estudiante" value="" />
          {estudiantesPostulados.map((est) => (
            <Picker.Item key={est.id} label={est.nombre} value={est.id} />
          ))}
      </Picker>


      <Text style={styles.label}>Monto</Text>
      <TextInput
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
        style={styles.input}
        placeholder="Ingrese el monto"
      />


      <View style={styles.buttonRow}>

        <TouchableOpacity style={styles.buttonCreate} onPress={crearBeneficio}>
          <Text style={styles.buttonText}>Crear beneficio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
