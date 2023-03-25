import firebase from 'firebase/compat/app'; // import firebase app module
import 'firebase/compat/firestore'; // import firestore module


const firebaseConfig = {
    apiKey: "AIzaSyBW9SQp5ykXivaieHdwZt0k6NJrLR_kLGE",
    authDomain: "upchat-6e2a0.firebaseapp.com",
    projectId: "upchat-6e2a0",
    storageBucket: "upchat-6e2a0.appspot.com",
    messagingSenderId: "596168715193",
    appId: "1:596168715193:web:2ae212cc3785154f9b2468",
    measurementId: "G-E4KQ85PYTY"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();