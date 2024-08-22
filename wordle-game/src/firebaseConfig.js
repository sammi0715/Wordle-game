import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "dive-into-topic-11f57.firebaseapp.com",
    projectId: "dive-into-topic-11f57",
    storageBucket: "dive-into-topic-11f57.appspot.com",
    messagingSenderId: "200899371683",
    appId: "1:200899371683:web:5c45d374d013d3e2c65516"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
