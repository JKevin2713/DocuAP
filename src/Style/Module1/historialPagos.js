import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
  },
  filtros: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  filtroBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#eee',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filtroActivo: {
    backgroundColor: '#3b5998',
    borderColor: '#3b5998',
  },
  filtroTexto: {
    color: '#333',
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  estado: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 12,
    color: 'white',
    overflow: 'hidden',
  },
  aprobado: {
    backgroundColor: '#4caf50',
  },
  inactivo: {
    backgroundColor: '#f44336',
  },
  detallesBtn: {
    backgroundColor: '#3b5998',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  detallesText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
