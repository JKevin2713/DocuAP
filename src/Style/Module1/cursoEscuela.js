import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      marginTop: 10,
      marginHorizontal: 10,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      marginHorizontal: 10,
    },
    label: {
      marginRight: 5,
    },
    entriesBox: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderWidth: 1,
      marginRight: 10,
      borderRadius: 5,
    },
    entriesText: {
      fontWeight: 'bold',
    },
    search: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      height: 40,
    },
    toggleRow: {
      flexDirection: 'row',
      marginBottom: 20,
      marginTop: 10,
      marginHorizontal: 10,
    },
    toggleButton: {
      flex: 1,
      borderWidth: 1,
      padding: 10,
      alignItems: 'center',
      borderRadius: 8,
      marginHorizontal: 5,
    },
    toggleButtonActive: {
      flex: 1,
      backgroundColor: '#1a73e8',
      padding: 10,
      alignItems: 'center',
      borderRadius: 8,
      marginHorizontal: 5,
    },
    toggleText: {
      color: '#1a73e8',
      fontWeight: 'bold',
    },
    toggleTextActive: {
      color: 'white',
      fontWeight: 'bold',
    },
    cardsContainer: {
      paddingBottom: 50,
      paddingHorizontal: 5,
    },
    card: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 15,
      margin: 5,
      minWidth: '45%',
    },
    cardTitle: {
      fontWeight: 'bold',
      marginBottom: 5,
      fontSize: 16,
    },
    updateLink: {
      color: '#1a73e8',
      marginTop: 10,
    },
  });