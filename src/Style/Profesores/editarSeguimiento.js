import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    contentContainer: {
      padding: 16,
      backgroundColor: '#405F9021',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 30,
    },
    editButton: {
      backgroundColor: '#405F90',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 5,
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    backButton: {
      backgroundColor: '#405F90',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 5,
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  