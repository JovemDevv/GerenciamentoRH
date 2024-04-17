// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDob1VNRzQVfPNhGKSaFmxYWjYFtkqmmsA",
  authDomain: "admin-funcionarios.firebaseapp.com",
  projectId: "admin-funcionarios",
  storageBucket: "admin-funcionarios.appspot.com",
  messagingSenderId: "1021091505357",
  appId: "1:1021091505357:web:bc045b3caf4fb70a923584",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
