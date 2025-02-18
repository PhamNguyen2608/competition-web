export const ENV = {
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDbDQvYoMdcVMptxwr44gr6KRjnQ2syzp4",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "hoilhpnls-3cc3f.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "hoilhpnls-3cc3f",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "hoilhpnls-3cc3f.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "759088894164",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:759088894164:web:e2fcaf415c14d156992b41",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-9P6YT2160Y"
  }
} as const; 