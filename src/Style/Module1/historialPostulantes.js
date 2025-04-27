import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    activeFilter: {
      backgroundColor: '#4D7FBF',
    },
    cell: {
      width: '12.5%',
    },
    container: {
      backgroundColor: '#fff',
      flex: 1,
      padding: 20,
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      gap: 10,
      flexWrap: 'wrap',
    },
    detailsButton: {
      backgroundColor: '#4D7FBF',
      borderRadius: 5,
      padding: 5,
      width: '12.5%',
    },
    detailsButtonText: {
      color: 'white',
      textAlign: 'center',
    },
    entriesBox: {
      backgroundColor: '#eee',
      padding: 5,
      borderRadius: 5,
    },
    estado: {
      width: '12.5%',
      textAlign: 'center',
      borderRadius: 10,
      padding: 2,
    },
    filterButton: {
      backgroundColor: '#BFD9F2',
      padding: 10,
      borderRadius: 8,
    },
    filterDropdowns: {
      flexDirection: 'column',
      gap: 10,
      flex: 1,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    filterText: {
      color: 'white',
      fontWeight: 'bold',
    },
    header: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    logo: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    picker: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 0.5,
      borderColor: '#ccc',
      paddingVertical: 8,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 5,
      borderRadius: 5,
      flex: 1,
      minWidth: 120,
    },
    subheader: {
      color: '#888',
      marginBottom: 10,
    },
    tableHeader: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 1,
      paddingBottom: 5,
    },
    tableHeaderText: {
      fontWeight: 'bold',
      width: '12.5%',
    },
  });
  