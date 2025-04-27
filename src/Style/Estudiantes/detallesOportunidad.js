import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    marginBottom: 10
  },
  headerLogo: {
    width: 170,
    height: 50,
    marginLeft: -70  
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: -15 
    
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A2458',
    marginBottom: 15
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
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#405F90'
  },
  cardText: {
    fontSize: 14,
    marginBottom: 10
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#405F90',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5
  },
  applyButton: {
    backgroundColor: '#405F90'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
