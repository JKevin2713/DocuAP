import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput} from "react-native";
import {styles} from "../../Style/Module1/publiOferta";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import URL from '../../Services/url';

export default function OfertasScreen() {
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todo");
  const [ofertasOriginales, setOfertasOriginales] = useState([]);
  const [ofertas, setOfertas] = useState();
  const router = useRoute();
  const { userId } = router.params;

  useEffect(() => {
      const fetchData = async () => {
          const datos = await handleInformacion();
          if (datos) {
              setOfertas(datos);
              setOfertasOriginales(datos);
          }
      };
      fetchData();
  }, []);

  const handleInformacion = async () => {
      try {
          const apiUrl = `${URL}:3000`;
          const response = await axios.get(`${apiUrl}/escuelas/historialOfertas`, {
              params: { userId },
          });

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
    

  const filtrarOfertas = (texto) => {
    setSearch(texto);
    actualizarFiltro(texto, estadoFiltro);
  };

  const filtrarPorEstado = (estado) => {
    setEstadoFiltro(estado);
    actualizarFiltro(search, estado);
  };

  const actualizarFiltro = (texto, estado) => {
    let filtradas = [...ofertasOriginales]; // <-- Parte desde las originales
  
    if (estado !== "Todo") {
      filtradas = filtradas.filter((oferta) => oferta.estado === estado);
    }
  
    if (texto !== "") {
      filtradas = filtradas.filter((oferta) =>
        oferta.nombre.toLowerCase().includes(texto.toLowerCase())
      );
    }
  
    setOfertas(filtradas);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estados de las ofertas</Text>
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
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar..."
        value={search}
        onChangeText={filtrarOfertas}
      />
      <FlatList
        data={ofertas}
        keyExtractor={(item) => item.nombre}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.offerName}>{item.nombre}</Text>
            <Text>Tipo: {item.tipo}</Text>
            <View style={styles.chip}><Text style={styles.chipText}>{item.estado}</Text></View>
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