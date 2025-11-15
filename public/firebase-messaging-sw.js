/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDoZ09mmyEUS4FCGw6xbh4BOgA-hQORu6E",
  authDomain: "e4you-dad72.firebaseapp.com",
  projectId: "e4you-dad72",
  storageBucket: "e4you-dad72.firebasestorage.app",
  messagingSenderId: "782257434604",
  appId: "1:782257434604:web:507e2cdf2c930f0d7a5ac9",
  measurementId: "G-Z5TM8WJSQ2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png"
  });
});
