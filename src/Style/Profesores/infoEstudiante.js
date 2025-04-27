import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    sectionContainer: {
      marginBottom: 20,
      backgroundColor: '#405F9021',
      padding: 15,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    dataContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
    },
    infoText: {
      fontSize: 16,
      marginBottom: 4,
      color: '#555',
    },
    documentosContainer: {
      // Puedes ajustar este contenedor si necesitas
    },
    documentCard: {
      backgroundColor: '#f9f9f9',
      padding: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    documentDetails: {
      flex: 1,
    },
    documentTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#333',
    },
    documentDate: {
      fontSize: 14,
      color: '#777',
    },
    downloadButton: {
      backgroundColor: '#405F90',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
    },
    downloadButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    approveButton: {
      backgroundColor: '#405F90',
    },
    rejectButton: {
      backgroundColor: '#405F90',
    },
    meetingButton: {
      backgroundColor: '#405F90',
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
      backgroundColor: '#405F90',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });