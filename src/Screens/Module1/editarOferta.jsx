//---------------------------------------------------------------------------------------------------------------
// Descripción general:
// Este componente de React Native permite editar una oferta existente (asistencia o tutoría).
// Carga los datos actuales de la oferta, permite modificarlos y enviarlos al backend.
//---------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'; // Hooks de navegación y rutas
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Componente Picker (dropdown)
import DateTimePicker from '@react-native-community/datetimepicker'; // Componente de selección de fecha
import { styles } from '../../Style/Module1/crearOferta'; // Estilos personalizados
import axios from 'axios'; // Cliente HTTP
import URL from '../../Services/url'; // URL base del servidor

//---------------------------------------------------------------------------------------------------------------
// Componente principal - Editar Oferta
//---------------------------------------------------------------------------------------------------------------
export default function EditarOfertaScreen() {
    // Estados para cada campo editable
    const [nombreCurso, setNombreCurso] = useState('');
    const [profesor, setProfesor] = useState('');
    const [tipo, setTipo] = useState('');
    const [tipoPago, setTipoPago] = useState('');
    const [estado, setEstado] = useState('');
    const [estudiantes, setEstudiantes] = useState('');
    const [horas, setHoras] = useState('');
    const [beneficio, setBeneficio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [requisitos, setRequisitos] = useState('');
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaCierre, setFechaCierre] = useState(new Date());
    const [showInicio, setShowInicio] = useState(false);
    const [showCierre, setShowCierre] = useState(false);
    const [promedioMinimo, setPromedioMinimo] = useState('');
    const [cursosPrevios, setCursosPrevios] = useState('');
    const [horasMaximas, setHorasMaximas] = useState('');
    const [requisitosAdicionales, setRequisitosAdicionales] = useState('');
    const [listaProfesores, setListaProfesores] = useState([]);

    const route = useRoute();
    const navigation = useNavigation();
    const { oferta, userId } = route.params; // Extraer parámetros enviados

    //-------------------------------------------------------------------------------------------------------------
    // Hook para cargar datos de la oferta y profesores disponibles
    //-------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        console.log("Ejecutando useEffect, oferta:", oferta);
        const fetchData = async () => {
            await handleInformacionOferta();
            const data = await handleInformacionProfesor();
            setListaProfesores(data);
        };
        fetchData();
    }, []);

    //-------------------------------------------------------------------------------------------------------------
    // Función para obtener los datos de la oferta actual
    //-------------------------------------------------------------------------------------------------------------
    const handleInformacionOferta = async () => {
        try {
            const apiUrl = `${URL}:3000`;
            const response = await axios.get(`${apiUrl}/escuelas/informacionOferta`, { params: { oferta } });

            if (response.status === 200) {
                const data = response.data.ofertaInfo;
                setNombreCurso(data.tituloPrograma);
                setProfesor(data.profesor);
                setTipo(data.tipo);
                setTipoPago(data.tipoPago);
                setEstado(data.estado);
                setEstudiantes(data.cantidadVacantes);
                setHoras(data.horas);
                setCursosPrevios(data.cursosPrevios);
                setPromedioMinimo(data.promedioRequerido);
                setBeneficio(data.beneficio);
                setDescripcion(data.descripcion);
                setRequisitosAdicionales(data.requisitosAdicionales);
                console.log("Datos de la oferta:", data);
            } else {
                console.error("Error al obtener los datos:", response.statusText);
                alert("Error al obtener los datos de la oferta.");
            }
        } catch (error) {
            console.error("Error al obtener la oferta:", error);
            alert("Error de red o del servidor.");
        }
    };

    //-------------------------------------------------------------------------------------------------------------
    // Función para obtener la lista de profesores
    //-------------------------------------------------------------------------------------------------------------
    const handleInformacionProfesor = async () => {
        try {
            const apiUrl = `${URL}:3000`;
            const response = await axios.get(`${apiUrl}/escuelas/profesoresEscuela`, { params: { userId } });
            return response.data.profesor;
        } catch (error) {
            console.error("Error al hacer la solicitud:", error);
            alert("Error de red o del servidor.");
            return null;
        }
    };

    //-------------------------------------------------------------------------------------------------------------
    // Función para actualizar la oferta en la base de datos
    //-------------------------------------------------------------------------------------------------------------
    const handleCrearOferta = async () => {
        const data = {
            id: userId,
            tituloPrograma: nombreCurso,
            personaACargo: profesor,
            cantidadVacantes: estudiantes,
            tipo: tipo,
            beneficio: tipoPago,
            promedioRequerido: promedioMinimo,
            requisitos: cursosPrevios,
            descripcion: descripcion,
            requisitosAdicionales: requisitosAdicionales,
            fechaInicio: fechaInicio.toISOString().split('T')[0],
            fechaFin: fechaCierre.toISOString().split('T')[0],
        };

        // Validar que todos los campos estén llenos
        const camposRequeridos = [
            "id", "tituloPrograma", "personaACargo", "tipo", 
            "cantidadVacantes", "beneficio", "promedioRequerido", 
            "requisitos", "descripcion", "requisitosAdicionales", "fechaInicio", "fechaFin"
        ];
        const camposFaltantes = camposRequeridos.filter(campo => !data[campo]);
        if (camposFaltantes.length > 0) {
            alert(`⚠️ Por favor complete los siguientes campos: ${camposFaltantes.join(", ")}`);
            return;
        }

        try {
            const apiUrl = `${URL}:3000`;
            const response = await axios.put(`${apiUrl}/escuelas/actualizarOferta`, { data: data, id: oferta });
            console.log("Respuesta del servidor:", response.data);
            alert("Oferta actualizada exitosamente.");
            navigation.goBack();
        } catch (error) {
            console.error("Error al actualizar la oferta:", error);
            alert("Error de red o del servidor.");
        }
    };

    //-------------------------------------------------------------------------------------------------------------
    // Renderizado de la pantalla para editar la oferta
    //-------------------------------------------------------------------------------------------------------------
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar oferta</Text>

            {/* Campos de formulario */}
            <Text>Nombre de la oferta</Text>
            <TextInput style={styles.input} value={nombreCurso} onChangeText={setNombreCurso} />

            {/* Selección de profesor */}
            <Text>Nombre del profesor</Text>
            <Picker
                selectedValue={profesor}
                onValueChange={setProfesor}
                style={styles.picker}
            >
                <Picker.Item label="Seleccione un profesor" value="" />
                {listaProfesores.map((prof) => (
                    <Picker.Item key={prof.id} label={prof.titulo} value={prof.id} />
                ))}
            </Picker>

            {/* Selección de tipo */}
            <View style={styles.row}>
                <View style={styles.pickerContainer}>
                    <Text>Tipo</Text>
                    <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
                        <Picker.Item label="Seleccione el tipo" value="" />
                        <Picker.Item label="Tutoría" value="tutoria" />
                        <Picker.Item label="Asistencia" value="asistencia" />
                    </Picker>
                </View>
            </View>

            {/* Selección de tipo de beneficio */}
            <View style={styles.row}>
                <View style={styles.pickerContainer}>
                    <Text>Tipo de beneficio</Text>
                    <Picker selectedValue={tipoPago} onValueChange={setTipoPago} style={styles.picker}>
                        <Picker.Item label="Seleccione el pago" value="" />
                        <Picker.Item label="Exoneración" value="Exoneracion" />
                        <Picker.Item label="Remuneración" value="Remuneracion" />
                    </Picker>
                </View>
            </View>

            {/* Número de estudiantes */}
            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <Text>Número de estudiantes</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={estudiantes} onChangeText={setEstudiantes} />
                </View>
            </View>

            {/* Selección de fechas */}
            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <Text>Fecha de inicio</Text>
                    <TouchableOpacity onPress={() => setShowInicio(true)} style={styles.input}>
                        <Text>{fechaInicio.toISOString().split('T')[0]}</Text>
                    </TouchableOpacity>
                    {showInicio && (
                        <DateTimePicker
                            value={fechaInicio}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowInicio(false);
                                if (selectedDate) setFechaInicio(selectedDate);
                            }}
                        />
                    )}
                </View>

                <View style={styles.halfInput}>
                    <Text>Fecha de cierre</Text>
                    <TouchableOpacity onPress={() => setShowCierre(true)} style={styles.input}>
                        <Text>{fechaCierre.toISOString().split('T')[0]}</Text>
                    </TouchableOpacity>
                    {showCierre && (
                        <DateTimePicker
                            value={fechaCierre}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowCierre(false);
                                if (selectedDate) setFechaCierre(selectedDate);
                            }}
                        />
                    )}
                </View>
            </View>

            {/* Políticas internas */}
            <Text style={styles.title}>Políticas internas</Text>

            <Text>Promedio mínimo requerido</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={promedioMinimo} onChangeText={setPromedioMinimo} />

            <Text>Cursos previos aprobados y notas</Text>
            <TextInput style={[styles.input, { height: 80 }]} multiline value={cursosPrevios} onChangeText={setCursosPrevios} />

            <Text>Horas máximas por semestre</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={horas} onChangeText={setHoras} />

            <Text>Requisitos adicionales</Text>
            <TextInput style={[styles.input, { height: 80 }]} multiline value={requisitosAdicionales} onChangeText={setRequisitosAdicionales} />

            <Text>Descripción</Text>
            <TextInput style={[styles.input, { height: 80 }]} multiline value={descripcion} onChangeText={setDescripcion} />

            {/* Botón de guardar cambios */}
            <TouchableOpacity style={styles.button} onPress={handleCrearOferta}>
                <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
