// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// SAME config as firebase.js (measurementId not required here but ok)
firebase.initializeApp({
  apiKey: "AIzaSyCurgvew2gVG5S4_rkRhOYyhmNSk4BU4qY",
  authDomain: "campus-hub-2cd64.firebaseapp.com",
  projectId: "campus-hub-2cd64",
  storageBucket: "campus-hub-2cd64.firebasestorage.app",
  messagingSenderId: "1023468926608",
  appId: "1:1023468926608:web:cf0242c15d6f4337c7ca15",
  measurementId: "G-VP9DHVXVYD"
});

const messaging = firebase.messaging();

// Show notification when message arrives in background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Campus Hub';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon.png', // optional app icon file
    tag: 'campus-event'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
