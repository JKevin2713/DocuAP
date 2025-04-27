import  { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 16, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { height: 60, width: 160, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#002b5c' },
  card: {
    backgroundColor: '#f1f6ff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  label: { fontWeight: 'bold', color: '#002b5c', marginTop: 10 },
  text: { fontSize: 16, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  image: {
    width: 400,     // o 80, o 60 si quieres más pequeño
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  buttonContainer: { width: '100%', marginBottom: 20 },
  button: { marginVertical: 6 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#444' },
});
