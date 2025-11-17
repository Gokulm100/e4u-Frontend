import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastProvider } from './components/ToastContext';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from "@react-oauth/google"

const root = ReactDOM.createRoot(document.getElementById('root'));
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('FCM Service Worker registered with scope:', registration.scope);
      }).catch(function(err) {
        console.log('FCM Service Worker registration failed:', err);
      });
  });
}
root.render(
  <GoogleOAuthProvider clientId='556452370430-fd5caae668lq9468hbseas0kr3o1a01g.apps.googleusercontent.com'>
    <ToastProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ToastProvider>
  </GoogleOAuthProvider>
);

reportWebVitals();
