import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginBottom: 20,
  },
  headerContainer: {
    marginTop: 10,
    backgroundColor: "#405F9021",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#405F90",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  regresarButton: {
    backgroundColor: "#405F90",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  resetButton: {
    backgroundColor: "#405F90", // Color alternativo para restablecer
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  carouselContainer: {
    marginBottom: 20,
    padding: 30,
    backgroundColor: "#405F9021",

  },
  historialCardText: {
    fontSize: 12,
    marginBottom: 3,
  },
  historialCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 30,
    marginBottom: 10,
    marginRight: 10,
    width: 220,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
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
    marginBottom: 5,
  },
  cardDetail: {
    fontSize: 14,
    marginBottom: 3,
  },
  cardButton: {
    marginTop: 10,
    backgroundColor: "#405F90",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  historialContainer: {
    backgroundColor: "#405F9021",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tableRowText: {
    fontSize: 12,
    textAlign: "center",
  },
});