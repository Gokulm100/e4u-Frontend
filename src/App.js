import React, { useEffect } from 'react';
import './App.css';
import Landing from './pages/landing';
import { useToast } from './components/ToastContext';
import { requestPermission, listenForForegroundNotifications } from "./utils/notification";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
function App() {
  const { showToast } = useToast();

    useEffect(() => {
      const BearerToken = localStorage.getItem('authToken');
      if (!BearerToken) return;

      async function initFCM() {
        const token = await requestPermission();
        if (token) {
          await fetch(`${API_BASE_URL}/api/users/save-fcm-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json","Authorization": `Bearer ${BearerToken}` },
            body: JSON.stringify({ fcmToken: token })
          });
        }

        // Foreground notifications
        listenForForegroundNotifications((payload) => {
          showToast(
            (payload.notification.title ? payload.notification.title + ': ' : '') +
            (payload.notification.body || ''),
            'info',
            4000
          );
        });
        
      }

      initFCM();
    }, [showToast]);
  return (
    <div className="App">
      <Landing />
    </div>
  );
}

export default App;