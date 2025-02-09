// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLaUlO39CGjjqPZvwEn17wD01Om4KWw34",
  authDomain: "thesis-conversation-react.firebaseapp.com",
  projectId: "thesis-conversation-react",
  storageBucket: "thesis-conversation-react.firebasestorage.app",
  messagingSenderId: "475413729728",
  appId: "1:475413729728:web:6e894e408a4f1f255cb825",
  measurementId: "G-DCEGQLLBFN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
