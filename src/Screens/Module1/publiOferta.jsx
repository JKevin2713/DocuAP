// -------------------------------------------------------------------------------------------------------------
// Descripción:
// Pantalla que muestra el historial de ofertas activas de tutorías, asistencias o proyectos
// Permite:
// - Buscar ofertas
// - Filtrar ofertas por estado
// - Crear una nueva oferta
// - Editar una oferta existente
// -------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import { styles } from "../../Style/Module1/publiOferta"; // Estilos personalizados
import { useRoute } from '@react-navigation/native';       // Para recibir parámetros de navegación
import axios from "axios";                                 // Cliente HTTP
import URL from '../../Services/url';                      // URL base de la API

// -------------------------------------------------------------------------------------------------------------
// Componente principal - OfertasScreen
// -------------------------------------------------------------------------------------------------------------
export default function OfertasScreen() {

    // Estados principales
    const [search, setSearch] = useState("");                  // Texto de búsqueda
    const [estadoFiltro, setEstadoFiltro] = useState("Todo");   // Filtro de estado
    const [ofertas, setOfertas] = useState();                   // Lista de ofertas filtradas
    const [ofertasOriginales, setOfertasOriginales] = useState(); // Lista original (sin filtros)
    const navigation = useNavigation();
    const router = useRoute();
    const { userId } = router.params;                           // Obtener el userId de navegación

    // ---------------------------------------------------------------------------------------------------------
    // useEffect para cargar los datos al montar el componente
    // ---------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            const datos = await handleInformacion();
            if (datos) {
                setOfertas(datos);             // Cargar tanto las ofertas a mostrar
                setOfertasOriginales(datos);   // como las originales para filtrar
            }
        };
        fetchData();
    }, []);

    // ---------------------------------------------------------------------------------------------------------
    // Función que consulta la API para obtener las ofertas activas
    // ---------------------------------------------------------------------------------------------------------
    const handleInformacion = async () => {
        try {
            const apiUrl = `${URL}:3000`;
            const response = await axios.get(`${apiUrl}/escuelas/historialOfertasActivas`, {
                params: { userId }
            });

            if (response.status === 200) {
                return response.data.ofertasActuales;
            } else {
                console.error("Error al obtener los datos:", response.statusText);
                return null;
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            return null;
        }
    };

    // ---------------------------------------------------------------------------------------------------------
    // Funciones auxiliares para filtrar
    // ---------------------------------------------------------------------------------------------------------
    const filtrarOfertas = (texto) => {
        setSearch(texto);
        actualizarFiltro(texto, estadoFiltro);
    };

    const filtrarPorEstado = (estado) => {
        setEstadoFiltro(estado);
        actualizarFiltro(search, estado);
    };

    const actualizarFiltro = (texto, estado) => {
        let filtradas = ofertasOriginales;

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

    // ---------------------------------------------------------------------------------------------------------
    // Renderizado principal
    // ---------------------------------------------------------------------------------------------------------
    return (
        <View style={styles.container}>

            {/* Título principal */}
            <Text style={styles.title}>Estados de las ofertas</Text>

            {/* Filtros de estado */}
            <View style={styles.filters}>
                {['Todo', 'Abierto', 'Revision'].map((estado) => (
                    <TouchableOpacity
                        key={estado}
                        style={[styles.filterButton, estadoFiltro === estado && styles.activeFilter]}
                        onPress={() => filtrarPorEstado(estado)}
                    >
                        <Text style={styles.filterText}>{estado}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Botón para crear nueva oferta */}
            <TouchableOpacity
                style={styles.newOfferButton}
                onPress={() => navigation.navigate("crearOferta", { userId: userId })}
            >
                <Text style={styles.newOfferText}>+ Nueva oferta</Text>
            </TouchableOpacity>

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

                        {/* Botón para editar oferta */}
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate("editarOferta", { oferta: item.idAsistencia, userId: userId })}
                        >
                            <Text style={styles.editText}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

        </View>
    );
}
