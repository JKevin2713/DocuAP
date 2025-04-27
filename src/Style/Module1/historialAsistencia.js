import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F6FA',
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      alignSelf: 'center',
      marginBottom: 16,
      color: '#2E4C85',
    },
    searchContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      gap: 10,
    },
    search: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    filterButton: {
      backgroundColor: '#4D6EF5',
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    filterText: {
      color: '#fff',
      fontWeight: '600',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 18,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardDate: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2E4C85',
      marginBottom: 12,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      fontWeight: '600',
      fontSize: 14,
      color: '#444',
    },
    value: {
      fontSize: 14,
      color: '#333',
    },
    estado: {
      backgroundColor: '#D4F4D1',
      color: '#2C6B2E',
      fontSize: 13,
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 6,
      overflow: 'hidden',
      fontWeight: '500',
    },
    valoracion: {
      backgroundColor: '#2E4C85',
      color: '#fff',
      fontSize: 13,
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 6,
      overflow: 'hidden',
      fontWeight: '500',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalBox: {
      backgroundColor: '#fff',
      padding: 20,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    modalOption: {
      paddingVertical: 10,
    },
    modalClear: {
      marginTop: 10,
      color: '#4D6EF5',
      fontWeight: '600',
    },
  });
  