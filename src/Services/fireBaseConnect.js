// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRt-8dJxvmFW0LWJJVSuTGZVg6kXvZEqw",
  authDomain: "projecto-ap-44a00.firebaseapp.com",
  projectId: "projecto-ap-44a00",
  storageBucket: "projecto-ap-44a00.firebasestorage.app",
  messagingSenderId: "551130831686",
  appId: "1:551130831686:web:b1cb84748e32d87eefe347"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
 