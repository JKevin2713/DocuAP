import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1, padding: 16, backgroundColor: '#fff',
    },
    cardsContainer: {
      flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16,
    },
    card: {
      backgroundColor: '#eef1ff', borderRadius: 8, padding: 16, flex: 1, margin: 4,
      alignItems: 'center',
    },
    cardTitle: { fontWeight: 'bold', marginBottom: 8 },
    cardValue: { fontSize: 20, fontWeight: 'bold' },
    filtersRow: {
      flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12,
    },
    dropdownContainer: {
      flex: 1, backgroundColor: '#3366cc', marginHorizontal: 4, borderRadius: 8,
    },
    picker: {
      color: 'white', height: 40,
    },
    buttonGroup: {
      flexDirection: 'row', justifyContent: 'center', marginBottom: 12,
    },
    filterButton: {
      backgroundColor: '#3366cc', borderRadius: 8, padding: 10, marginHorizontal: 4,
    },
    activeButton: {
      backgroundColor: '#1f4bb8',
    },
    buttonText: {
      color: 'white', fontWeight: 'bold',
    },
    title: {
      fontWeight: 'bold', fontSize: 16, marginVertical: 8,
    },
    row: {
      flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,
    },
    newButton: {
      backgroundColor: '#3366cc', padding: 12, borderRadius: 8, alignItems: 'center',
      marginTop: 16,
    }, 
    tableContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      marginTop: 10,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#3366cc',
      paddingVertical: 10,
    },
    headerCell: {
      flex: 1,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    rowCell: {
      flex: 1,
      textAlign: 'center',
    },
    
  });
  