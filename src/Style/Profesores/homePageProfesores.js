import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        
      flex: 1,
      backgroundColor: '#f5f5f5',
      marginTop: 20,
      padding: 16
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333'
    },
    contactContainer: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      marginBottom: 24,
      elevation: 3, // Android
      shadowColor: '#000', // iOS
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 }
    },
    headerText: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 12,
      color: '#333'
    },
    label: {
      fontSize: 16,
      marginBottom: 4,
      color: '#555'
    },
    value: {
      fontWeight: 'bold'
    },
    buttonsContainer: {
      borderRadius: 8,
      marginBottom: 15,
    },
    button: {
      backgroundColor: '#405F9021',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 12
    },
    buttonText: {
      color: '#black',
      fontSize: 16,
      textAlign: 'center'
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 24
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain'
    }
  });