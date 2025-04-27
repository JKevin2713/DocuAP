import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9ff', flex: 1 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginTop: 10, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 5
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 5,
    borderRadius: 6
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30
  },
  buttonCancel: {
    backgroundColor: '#3b5998',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10
  },
  buttonCreate: {
    backgroundColor: '#3b5998',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  }
});
