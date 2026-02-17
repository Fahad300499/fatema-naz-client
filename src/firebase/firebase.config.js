// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwHusOOlEW-g_P0PHifuLCACcml5wjvdg",
  authDomain: "naz-petrolium.firebaseapp.com",
  projectId: "naz-petrolium",
  storageBucket: "naz-petrolium.firebasestorage.app",
  messagingSenderId: "469648451257",
  appId: "1:469648451257:web:93cf00988224b71e119d68"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);