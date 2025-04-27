import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  headerLogo: {
    width: 200,
    height: 60,
    marginLeft: -70  // o -15 si lo querés más pegado aún
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: -15 // o -15 si lo querés más pegado 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A2458',
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff'
  },
  searchButton: {
    backgroundColor: '#405F90',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 5
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  filterText: {
    fontWeight: '500'
  },
  cardsContainer: {
    flexDirection: 'column',
    gap: 15
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
  cardText: {
    fontSize: 14,
    marginBottom: 3
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  detailButton: {
    backgroundColor: '#405F90',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 5
  },
  applyButton: {
    backgroundColor: '#405F90',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
