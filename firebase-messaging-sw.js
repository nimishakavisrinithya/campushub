importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCurgvew2gVG5S4_rkRhOYyhmNSk4BU4qY",
  authDomain: "campus-hub-2cd64.firebaseapp.com",
  projectId: "campus-hub-2cd64",
  storageBucket: "campus-hub-2cd64.firebasestorage.app",
  messagingSenderId: "1023468926608",
  appId: "1:1023468926608:web:b820242809f58c20c7ca15",
  measurementId: "G-FQNTWH2VSN"
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png"
  });
});