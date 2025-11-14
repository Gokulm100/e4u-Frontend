import React from 'react';
import './App.css';
import Landing from './pages/landing';
import { ToastProvider } from './components/ToastContext';

function App() {
  const hasSubscribed = React.useRef(false);

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  React.useEffect(() => {
    const setupPushNotifications = async () => {
      // Prevent double execution
      if (hasSubscribed.current) {
        console.log('Already attempted subscription, skipping...');
        return;
      }
      hasSubscribed.current = true;

      console.log('🔍 Starting push notification setup...');
      
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error('❌ Browser does not support push notifications');
        return;
      }

      try {
        // Unregister any existing service workers first
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
          console.log('Unregistered old service worker');
        }

        // Wait a bit for cleanup
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('🔍 Registering fresh service worker...');
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });
        console.log('✅ Service Worker registered');

        console.log('🔍 Waiting for service worker to activate...');
        if (registration.installing) {
          await new Promise((resolve) => {
            registration.installing.addEventListener('statechange', (e) => {
              if (e.target.state === 'activated') {
                resolve();
              }
            });
          });
        } else {
          await navigator.serviceWorker.ready;
        }
        console.log('✅ Service Worker is active');

        console.log('🔍 Requesting notification permission...');
        const permission = await Notification.requestPermission();
        
        if (permission !== 'granted') {
          console.log('❌ Notification permission denied');
          return;
        }
        console.log('✅ Notification permission granted');

        // Wait a bit before subscribing
        await new Promise(resolve => setTimeout(resolve, 1000));

const vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";
        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
        
        console.log('🔍 Subscribing to push notifications...');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey
        });

        console.log('✅✅✅ SUCCESS! Push subscription:', subscription);
        
        // Store it
        localStorage.setItem('pushSubscription', JSON.stringify(subscription));

      } catch (err) {
        console.error('❌ Push notification error:', err.name, err.message);
        
        // Reset the flag so user can try again
        hasSubscribed.current = false;
      }
    };

    setupPushNotifications();
  }, []);

  return (
    <ToastProvider>
      <div className="App">
        <Landing />
      </div>
    </ToastProvider>
  );
}

export default App;