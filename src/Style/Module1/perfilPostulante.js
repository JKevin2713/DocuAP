import { StyleSheet } from 'react-native';
// 🎨 Estilos separados pero en el mismo archivo
export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7F9FC',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A2558',
    marginBottom: 16,
  },
  contenido: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    backgroundColor: '#EAF0FA',
    padding: 16,
    margin: 8,
    borderRadius: 12,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#0A2558',
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0A2558',
  },
  etiqueta: {
    fontWeight: 'bold',
    color: '#000',
  },
  dato: {
    marginBottom: 4,
    fontSize: 14,
  },
  oferta: {
    backgroundColor: '#3B5998',
    marginBottom: 8,
    borderRadius: 8,
  },
  chip: {
    backgroundColor: '#000',
    color: '#fff',
    padding: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: 4,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  boton: {
    paddingHorizontal: 16,
  },
});
