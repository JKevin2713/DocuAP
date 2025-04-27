import  { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      padding: 16,
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 30,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#002b5c',
      borderWidth: 2,
      borderColor: '#007aff',
      padding: 10,
      textAlign: 'center',
      width: '100%',
      backgroundColor: '#e6f0ff',
      marginBottom: 16,
    },
    card: {
      backgroundColor: '#e6eeff',
      width: '100%',
      borderRadius: 8,
      padding: 16,
      gap: 12,
    },
    label: {
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      borderRadius: 6,
      backgroundColor: '#fff',
    },
    textArea: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: '#fff',
      padding: 10,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    inputContainer: {
      flex: 1,
    },
    button: {
      marginTop: 16,
      alignSelf: 'flex-start',
    },
  });
  