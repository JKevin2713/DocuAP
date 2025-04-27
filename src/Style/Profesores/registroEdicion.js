import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 20
    },
    headerContainer: {
        marginTop: 10,
        backgroundColor: '#405F9021',
        paddingVertical: 15,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    formContainer: {

      flexGrow: 1,
      paddingBottom: 20,

    },
    header: {
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333'
    },
    inputGroup: {
      marginBottom: 15
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 5,
      color: '#444'
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      color: '#333'
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: 'center',
      marginHorizontal: 5
    },
    saveButton: {
      backgroundColor: '#405F90'
    },
    returnButton: {
      backgroundColor: '#405F90'
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500'
    }
  });