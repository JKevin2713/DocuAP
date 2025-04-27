import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
      flexGrow: 1,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    formGroup: {
      marginBottom: 20,
    },
    fieldContainer: {
      padding: 15,
      backgroundColor: '#405F9021',
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    picker: {
      height: 50,
      width: '100%',
    },
    textInput: {
      height: 100,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 30,
    },
    button: {
      backgroundColor: '#405F90',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      flex: 1,
      marginHorizontal: 8,
    },
    regresarButton: {
      backgroundColor: '#405F90',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
  });
  