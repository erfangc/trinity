// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "@firebase/auth";
import {getFirestore} from "@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNH057CKsGVvMVyWK9MQJi59MPUN-wPjQ",
    authDomain: "trinity-d32f2.firebaseapp.com",
    projectId: "trinity-d32f2",
    storageBucket: "trinity-d32f2.firebasestorage.app",
    messagingSenderId: "12665359913",
    appId: "1:12665359913:web:74721008db8b4de7cb9638",
    measurementId: "G-9T8LSXP6LN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

