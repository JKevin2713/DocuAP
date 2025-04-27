import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {
    View, Text, TextInput, ScrollView,
    TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../../Style/Module1/crearOferta';
import axios from 'axios';
import URL from '../../Services/url';
import { useNavigation } from '@react-navigation/native';


export default function EditarOfertaScreen() {
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
    const [promedioMinimo, setPromedioMinimo] = useState("");
    const [cursosPrevios, setCursosPrevios] = useState("");
    const [horasMaximas, setHorasMaximas] = useState("");
    const [requisitosAdicionales, setRequisitosAdicionales] = useState("");
    const [listaProfesores, setListaProfesores] = useState([]);
    const route = useRoute();
    const {oferta , userId} = route.params;
    const navigation = useNavigation();


    useEffect(() => {
        console.log("Ejecutando useEffect, oferta:", oferta);
        const fetchData = async () => {
            await handleInformacionOferta();
            const data = await handleInformacionProfesor();
            setListaProfesores(data);
        };
        fetchData();
    }, []);

    const handleInformacionOferta = async () => {
        try {
            const storedUrl = URL;
            const apiUrl = `${storedUrl}:3000`;
    
            const response = await axios.get(`${apiUrl}/escuelas/informacionOferta`, {
                params: { oferta }
            });
            
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
            }
             else { 
                console.error("Error al obtener los datos:", response.statusText);
                alert("Error al obtener los datos de la oferta.");
            }
        
        } catch (error) {
            console.error("Error al obtener la oferta:", error);
            alert("Error de red o del servidor.");
        }
    };

    const handleInformacionProfesor = async () => {
        try {
            const apiUrl = `${URL}:3000`;
            const response = await axios.get(`${apiUrl}/escuelas/profesoresEscuela`, { params : {userId }});   
            return response.data.profesor; 
        } catch (error) {
            console.error("Error al hacer la solicitud:", error);
            alert("Error de red o del servidor.");
            return null;
        }
    }

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
        fechaInicio: fechaInicio.toISOString().split('T')[0], // Formato YYYY-MM-DD
        fechaFin: fechaCierre.toISOString().split('T')[0], // Formato YYYY-MM-DD
    };
        // Validar que todos los campos estén presentes
    const camposRequeridos = [
        "id", "tituloPrograma", "personaACargo", "tipo", 
        "cantidadVacantes", "beneficio", "promedioRequerido", 
        "requisitos", "descripcion", "requisitosAdicionales", "fechaInicio", "fechaFin"
    ];

    const camposFaltantes = camposRequeridos.filter((campo) => {
        return data[campo] === undefined || data[campo] === null || data[campo] === '';
    });

    if (camposFaltantes.length > 0) {
        alert(`⚠️ Por favor complete los siguientes campos: ${camposFaltantes.join(", ")}`);
        return;
    }

        try {
            const apiUrl = `${URL}:3000`;
            const response = await axios.put(`${apiUrl}/escuelas/actualizarOferta`, { data: data, id: oferta });
            console.log("Respuesta del servidor:", response.data); // Verifica la respuesta del servidor
            alert("Oferta creada exitosamente.");
            navigation.goBack();
            
        }
        catch (error) {
            console.error("Error al hacer la solicitud:", error);
            alert("Error de red o del servidor.");
        
        }
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear nueva oferta</Text>
        <Text>Nombre de la oferta</Text>
        <TextInput style={styles.input} value={nombreCurso} onChangeText={setNombreCurso} />
        <Text>Nombre del profesor</Text>
        <Picker
            selectedValue={profesor}
            onValueChange={(value) => setProfesor(value)}
            style={styles.picker}
        >
            <Picker.Item label="Seleccione un profesor" value="" />
            {listaProfesores.map((prof) => (
                <Picker.Item
                    key={prof.id} // depende de la estructura
                    label={prof.titulo}
                    value={prof.id}
                />
            ))}
        </Picker>

        <View style={styles.row}>
            <View style={styles.pickerContainer}>
                <Text>Tipo</Text>
                <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
                    <Picker.Item label="Seleccione el tipo" value="" />
                    <Picker.Item label="Tutoria" value="tutoria" />
                    <Picker.Item label="Asistencia" value="asistencia" />
                </Picker>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.pickerContainer}>
                <Text>Tipo de beneficio</Text>
                <Picker selectedValue={tipoPago} onValueChange={setTipoPago} style={styles.picker}>
                    <Picker.Item label="Seleccione el pago" value="" />
                    <Picker.Item label="Exoneracion" value="Exoneracion" />
                    <Picker.Item label="Remuneracion" value="Remuneracion" />
                </Picker>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.halfInput}>
                <Text>Número de estudiantes</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={estudiantes} onChangeText={setEstudiantes} />
            </View>
        </View>
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
                        setShowInicio(false); // Ocultar picker
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
                        setShowCierre(false); // Ocultar picker
                        if (selectedDate) setFechaCierre(selectedDate);
                    }}
                />
            )}
        </View>
    </View>
        <Text style={styles.title}>Políticas internas</Text>

        <Text>Promedio mínimo requerido</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={promedioMinimo}
            onChangeText={setPromedioMinimo}
        />

        <Text>Cursos previos aprobados y notas</Text>
        <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            placeholder="Ej: Cálculo I: 85, Programación I: 90"
            value={cursosPrevios}
            onChangeText={setCursosPrevios}
        />

        <Text>Horas máximas por semestre</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={horas}
            onChangeText={setHoras}
        />

        <Text>Requisitos adicionales</Text>
        <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            placeholder="Ej: Entrevista, Prueba técnica, etc."
            value={requisitosAdicionales}
            onChangeText={setRequisitosAdicionales}
        />

        <Text>Descripcion</Text>
        <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            placeholder=""
            value={descripcion}
            onChangeText={setDescripcion}
        />

        <TouchableOpacity style={styles.button} onPress={() => handleCrearOferta()}>
            <Text style={styles.buttonText}>Crear oferta</Text>
        </TouchableOpacity>
    </ScrollView>
);
};
