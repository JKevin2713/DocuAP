import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    filters: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
    filterButton: { padding: 10, backgroundColor: "#007bff", borderRadius: 5 },
    filterText: { color: "white", fontWeight: "bold" },
    newOfferButton: { marginBottom: 10, backgroundColor: "#0056b3", padding: 10, borderRadius: 5, alignItems: "center" },
    newOfferText: { color: "white", fontWeight: "bold" },
    searchBar: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
    },
        offerName: { fontSize: 16, fontWeight: "bold" },
        chip: { backgroundColor: "#28a745", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, alignSelf: "flex-start", marginVertical: 5 },
        chipText: { color: "white", fontWeight: "bold" },
        editButton: {
        backgroundColor: "#007bff",
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        alignItems: "center",
    },
    editText: { color: "white", fontWeight: "bold" },
});