// firebase.js

// Firebase config (from your Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCurgvew2gVG5S4_rkRhOYyhmNSk4BU4qY",
  authDomain: "campus-hub-2cd64.firebaseapp.com",
  projectId: "campus-hub-2cd64",
  storageBucket: "campus-hub-2cd64.firebasestorage.app",
  messagingSenderId: "1023468926608",
  appId: "1:1023468926608:web:cf0242c15d6f4337c7ca15",
  measurementId: "G-VP9DHVXVYD"
};

// Initialize core Firebase services
firebase.initializeApp(firebaseConfig);

const auth      = firebase.auth();
const db        = firebase.firestore();
const messaging = firebase.messaging(); // used for FCM

// expose globally so other scripts can use them
window.firebaseAuth       = auth;
window.firebaseDb         = db;
window.firebaseMessaging  = messaging;
window.firebaseConfig     = firebaseConfig;
