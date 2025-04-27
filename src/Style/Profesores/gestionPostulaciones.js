import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      padding: 16,
    },
    headerContainer: {
      marginTop: 10,
      backgroundColor: "#405F9021",
      paddingVertical: 15,
      alignItems: "center",
      marginBottom: 10,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 16,
    },
    allFilterButtonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      marginBottom: 10,
      backgroundColor: "#405F9021",
      padding: 15,
    },
    filterButton: {
      width: "30%",
      marginVertical: 5,
      paddingVertical: 8,
      backgroundColor: "#ccc",
      borderRadius: 5,
      alignItems: "center",
    },
    activeFilterButton: {
      backgroundColor: "#405F90",
    },
    filterButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 14,
    },
    searchContainer: {
      flexDirection: "row",
      marginBottom: 10,
    },
    searchInput: {
      flex: 1,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: "#fff",
    },
    searchButton: {
      backgroundColor: "#405F90",
      marginLeft: 8,
      paddingHorizontal: 12,
      justifyContent: "center",
      borderRadius: 5,
    },
    searchButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    pickerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    label: {
      fontSize: 16,
      marginRight: 8,
    },
    picker: {
      flex: 1,
      height: 40,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
    },
    carouselContainer: {
      marginVertical: 10,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 12,
      marginRight: 10,
      width: 250,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 6,
    },
    cardDetail: {
      fontSize: 14,
      marginBottom: 4,
    },
    cardButton: {
      backgroundColor: "#405F90",
      paddingVertical: 8,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 6,
    },
    cardButtonText: {
      color: "#fff",
      fontWeight: "600",
    },
    regresarContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    regresarButton: {
      backgroundColor: "#405F90",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    regresarButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });