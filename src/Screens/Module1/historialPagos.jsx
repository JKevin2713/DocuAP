//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente muestra todos los beneficios financieros asignados a estudiantes (pagos o exoneraciones).
// Permite buscar por nombre, filtrar por estado (Activo, Inactivo, Todo) y navegar al perfil detallado del estudiante.
// Se conecta al backend para obtener los datos de los beneficiarios.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../../Style/Module1/historialPagos'; // Estilos personalizados
import URL from '../../Services/url'; // URL base del servidor
import axios from 'axios'; // Cliente HTTP

//---------------------------------------------------------------------------------------------------------------
// Componente principal - BeneficiosScreen
//---------------------------------------------------------------------------------------------------------------
export default function BeneficiosScreen() {
  // Estados principales
  const [filtro, setFiltro] = useState('Todo'); // Filtro por estado
  const [busqueda, setBusqueda] = useState(''); // Texto de búsqueda
  const [datos, setDatos] = useState(); // Datos obtenidos del backend
  const navigation = useNavigation(); // Hook para navegación
  const route = useRoute(); // Hook para ruta
  const { userId } = route.params; // Obtener userId de parámetros de navegación

  //-------------------------------------------------------------------------------------------------------------
  // Hook para cargar datos al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const data = await handleInformacion();
      setDatos(data);
    };
    fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener datos de los beneficiarios desde el backend
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
    try {
      const apiUrl = `${URL}:3000`;
      const response = await axios.get(`${apiUrl}/escuelas/historialBeneficiarios`, {
        params: { userId }
      });

      if (response.status === 200) {
        console.log('Datos obtenidos:', response.data);
        return response.data || [];
      } else {
        console.error('Error al obtener los datos:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return [];
    }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función para aplicar filtros de búsqueda y estado sobre los datos
  //-------------------------------------------------------------------------------------------------------------
  const filtrarBeneficios = () => {
    let resultados = datos || [];

    // Filtrado por estado
    if (filtro === 'Activo') {
      resultados = resultados.filter(b => b.estado === 'Aprobada');
    } else if (filtro === 'Inactivo') {
      resultados = resultados.filter(b => b.estado === 'Inactivo');
    }

    // Búsqueda por nombre de estudiante
    if (busqueda.trim() !== '') {
      resultados = resultados.filter(b =>
        b.estudiante.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return resultados;
  };

  const beneficiosFiltrados = filtrarBeneficios();

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado de cada fila de beneficio
  //-------------------------------------------------------------------------------------------------------------
  const renderBeneficio = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.estudiante}</Text>
      <Text style={styles.cell}>{item.carrera}</Text>
      <Text style={styles.cell}>{item.oferta}</Text>
      <Text style={styles.cell}>{item.tipo}</Text>
      <Text style={styles.cell}>${item.monto}</Text>
      <Text style={styles.cell}>{item.semestre}</Text>
      <TouchableOpacity
        style={styles.detallesBtn}
        onPress={() => navigation.navigate("perfilPostulante", { userId: item.idEstudiante })}
      >
        <Text style={styles.detallesText}>Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado principal de la pantalla
  //-------------------------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODOS LOS BENEFICIOS</Text>
      <Text style={styles.subtitle}>
        Administre todos los beneficios financieros asignados
      </Text>

      {/* Buscador de estudiantes */}
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Botones de filtro por estado */}
      <View style={styles.filtros}>
        {['Todo', 'Activo', 'Inactivo'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.filtroBtn,
              filtro === tipo && styles.filtroActivo,
            ]}
            onPress={() => setFiltro(tipo)}
          >
            <Text
              style={[
                styles.filtroTexto,
                filtro === tipo && { color: 'white' },
              ]}
            >
              {tipo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Encabezado de tabla */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Estudiante</Text>
        <Text style={styles.headerCell}>Carrera</Text>
        <Text style={styles.headerCell}>Oferta</Text>
        <Text style={styles.headerCell}>Tipo</Text>
        <Text style={styles.headerCell}>Monto</Text>
        <Text style={styles.headerCell}>Semestre</Text>
        <Text style={styles.headerCell}>Acciones</Text>
      </View>

      {/* Lista de beneficios */}
      <FlatList
        data={beneficiosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderBeneficio}
      />
    </View>
  );
}
