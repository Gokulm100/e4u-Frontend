// To target a specific chat when a notification is clicked, include adId, chatId, sellerId, or buyerId
// in the FCM message's data payload. Example:
//
// data: {
//   adId: '123',
//   chatId: 'abc',
//   sellerId: 'seller123',
//   buyerId: 'buyer456'
// }
//
// The app will use this info to open the correct chat modal.
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
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
    data: payload.data || {},
    actions: [
      {
        action: 'open_chat',
        title: 'Open Chat'
      }
    ]
  };
  alert("hii")
  self.registration.showNotification(payload.notification.title, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  if (event.action === 'open_chat' || event.notification?.data?.chatId) {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        if (clientList.length > 0) {
          // Focus the first tab and post a message to open chat
          clientList[0].focus();
          clientList[0].postMessage({ type: 'OPEN_CHAT', data: event.notification.data });
        } else {
          // If no client, open a new window (optionally with a chat route)
          clients.openWindow('/?openChat=1');
        }
      })
    );
  }
});
