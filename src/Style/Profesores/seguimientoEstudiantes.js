import { StyleSheet } from "react-native";  
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 16,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      backgroundColor: '#405F9021',
      paddingVertical: 15,
      padding: 30,
      marginBottom: 20,
    },
    pickerContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 20,
    },
    picker: {
      height: 50,
      width: '100%',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    cardDetail: {
      fontSize: 16,
      marginBottom: 5,
    },
    button: {
      backgroundColor: '#405F90',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignSelf: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: "row",
        padding: 0,
        justifyContent: "space-between",
        marginTop: 8,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
        paddingVertical: 10,
    }
  });