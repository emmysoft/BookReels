// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMzBvJzbf5l-eyhJTAhthVAgMz_-I3T2o",
  authDomain: "bookreels-56224.firebaseapp.com",
  projectId: "bookreels-56224",
  storageBucket: "bookreels-56224.firebasestorage.app",
  messagingSenderId: "311135651493",
  appId: "1:311135651493:web:bd03269520db8b5d876f4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const AUTH = getAuth(app);