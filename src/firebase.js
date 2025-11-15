// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoZ09mmyEUS4FCGw6xbh4BOgA-hQORu6E",
  authDomain: "e4you-dad72.firebaseapp.com",
  projectId: "e4you-dad72",
  storageBucket: "e4you-dad72.firebasestorage.app",
  messagingSenderId: "782257434604",
  appId: "1:782257434604:web:507e2cdf2c930f0d7a5ac9",
  measurementId: "G-Z5TM8WJSQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
