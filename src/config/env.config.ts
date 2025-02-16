export const ENV = {
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBixgYaMHBp1nn1GqeLk5aaxmcwyQ1K68k",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "competition-web-cfb49.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "competition-web-cfb49",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "competition-web-cfb49.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "117881561761",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:117881561761:web:d25987252c11cd642146e0",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-R5GVQC1HRM"
  }
} as const; 