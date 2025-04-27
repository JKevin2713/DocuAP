import  { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#F8FAFF',
    },
    header: {
      alignItems: 'flex-end',
      marginBottom: 16,
    },
    avatar: {
      backgroundColor: '#3B5998',
    },
    filtros: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 12,
      gap: 8,
    },
    azulBtn: {
      backgroundColor: '#3B5998',
      marginHorizontal: 4,
    },
    blancoTexto: {
      color: '#fff',
    },
    searchInput: {
      backgroundColor: '#fff',
      borderColor: '#DDD',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 40,
      marginBottom: 12,
    },
    filaMenus: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 12,
    },
    menuContainer: {
      flex: 1,
    },
    titulo: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    subtitulo: {
      fontSize: 14,
      color: '#555',
      marginBottom: 16,
    },
    tabla: {
      borderTopWidth: 1,
      borderColor: '#333',
    },
    filaEncabezado: {
      flexDirection: 'row',
      paddingVertical: 8,
      backgroundColor: '#E6ECF5',
    },
    encabezado: {
      flex: 1,
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'center',
    },
    fila: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderColor: '#999',
      paddingVertical: 10,
    },
    celda: {
      flex: 1,
      fontSize: 12,
      textAlign: 'center',
    },
    estado: {
      flex: 1,
      padding: 4,
      borderRadius: 8,
      textAlign: 'center',
      color: '#fff',
      fontSize: 12,
    },
    estadoAprobado: {
      backgroundColor: '#4CAF50',
    },
    estadoInactivo: {
      backgroundColor: '#F44336',
    },
    botonDetalles: {
      flex: 1,
      backgroundColor: '#3B5998',
      padding: 6,
      borderRadius: 6,
      alignItems: 'center',
    },
    textoDetalles: {
      color: '#fff',
      fontSize: 12,
    },
  });
  