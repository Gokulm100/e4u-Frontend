console.log('Service Worker loaded');

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  const title = 'Push Notification';
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/logo192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});