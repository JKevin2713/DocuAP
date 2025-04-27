import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20
  },

  // Encabezados
  headerContainer: {
    marginTop: 10,
    backgroundColor: '#405F9021',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#405F90',
  },

  // Formulario
  formContainer: {
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#444'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff'
  },

  // Picker
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fff'
  },

  // Botones
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    minWidth: 160
  },
  saveButton: {
    backgroundColor: '#405F90'
  },
  returnButton: {
    backgroundColor: '#405F90'
  },
  syncButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#405F90',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },

  // Documentos adicionales
  documentUploadBox: {
    height: 120,
    borderWidth: 2,
    borderColor: '#b0c4de',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6ecf5',
    marginTop: 10
  },
  uploadPlaceholder: {
    color: '#405F90',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center'
  },

  //Logo tec parte inicial 
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  headerLogo: {
    width: 200,
    height: 60,
    marginLeft: -70  // o -15 si lo querés más pegado aún
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: -15 // o -15 si lo querés más pegado
  }
  
  
});
