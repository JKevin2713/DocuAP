//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Pantalla que permite visualizar, buscar y filtrar las ofertas publicadas por la Escuela/Departamento
// - Filtrado por estado (Abierto, Revisión, Cerrado)
// - Buscador por nombre de oferta
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import { styles } from "../../Style/Module1/publiOferta"; // Estilos
import { useRoute } from '@react-navigation/native';      // Hook para obtener parámetros
import axios from "axios";
import URL from '../../Services/url';                     // URL base de API

//---------------------------------------------------------------------------------------------------------------
// Componente principal - OfertasScreen
//---------------------------------------------------------------------------------------------------------------
export default function OfertasScreen() {
  // Estados principales
  const [search, setSearch] = useState("");                    // Texto del buscador
  const [estadoFiltro, setEstadoFiltro] = useState("Todo");     // Estado seleccionado en los filtros
  const [ofertasOriginales, setOfertasOriginales] = useState([]); // Copia de todas las ofertas
  const [ofertas, setOfertas] = useState();                    // Ofertas que se muestran (filtradas)
  const router = useRoute();
  const { userId } = router.params; // Obtener userId desde navegación

  //-------------------------------------------------------------------------------------------------------------
  // useEffect para cargar las ofertas al montar el componente
  //-------------------------------------------------------------------------------------------------------------
  useEffect(() => {
      const fetchData = async () => {
          const datos = await handleInformacion();
          if (datos) {
              setOfertas(datos);
              setOfertasOriginales(datos); // Guardar también las originales
          }
      };
      fetchData();
  }, []);

  //-------------------------------------------------------------------------------------------------------------
  // Función para obtener las ofertas de la base de datos
  //-------------------------------------------------------------------------------------------------------------
  const handleInformacion = async () => {
      try {
          const apiUrl = `${URL}:3000`;
          const response = await axios.get(`${apiUrl}/escuelas/historialOfertas`, { params: { userId } });

          if (response.status === 200) {
              const data = response.data.ofertasActuales;
              console.log("Datos obtenidos:", data);
              return data;
          } else {
              console.error("Error al obtener los datos:", response.statusText);
              return null;
          }
      } catch (error) {
          console.error("Error al realizar la solicitud:", error);
          return null;
      }
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función que maneja la escritura en la barra de búsqueda
  //-------------------------------------------------------------------------------------------------------------
  const filtrarOfertas = (texto) => {
    setSearch(texto);
    actualizarFiltro(texto, estadoFiltro);
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función que maneja el cambio de estado (filtro por estado)
  //-------------------------------------------------------------------------------------------------------------
  const filtrarPorEstado = (estado) => {
    setEstadoFiltro(estado);
    actualizarFiltro(search, estado);
  };

  //-------------------------------------------------------------------------------------------------------------
  // Función que aplica los filtros de estado y búsqueda
  //-------------------------------------------------------------------------------------------------------------
  const actualizarFiltro = (texto, estado) => {
    let filtradas = [...ofertasOriginales]; // Siempre partir de las ofertas originales

    // Filtrar por estado si no es "Todo"
    if (estado !== "Todo") {
      filtradas = filtradas.filter((oferta) => oferta.estado === estado);
    }

    // Filtrar por texto de búsqueda
    if (texto !== "") {
      filtradas = filtradas.filter((oferta) =>
        oferta.nombre.toLowerCase().includes(texto.toLowerCase())
      );
    }

    setOfertas(filtradas); // Actualizar la lista filtrada
  };

  //-------------------------------------------------------------------------------------------------------------
  // Renderizado principal
  //-------------------------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      
      {/* Título principal */}
      <Text style={styles.title}>Estados de las ofertas</Text>

      {/* Botones de filtros por estado */}
      <View style={styles.filters}>
        {['Todo', 'Abierto', 'Revision', 'Cerrado'].map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[styles.filterButton, estadoFiltro === estado && styles.activeFilter]}
            onPress={() => filtrarPorEstado(estado)}
          >
            <Text style={styles.filterText}>{estado}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar..."
        value={search}
        onChangeText={filtrarOfertas}
      />

      {/* Listado de ofertas */}
      <FlatList
        data={ofertas}
        keyExtractor={(item) => item.nombre}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.offerName}>{item.nombre}</Text>
            <Text>Tipo: {item.tipo}</Text>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{item.estado}</Text>
            </View>
            <Text>Estudiantes: {item.estudiantes}</Text>
            <Text>Horas: {item.horas}</Text>
            <Text>Fecha límite: {item.fechaLimite}</Text>
            <Text>Beneficio: {item.beneficio}</Text>
          </View>
        )}
      />
      
    </View>
  );
}
