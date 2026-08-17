// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBacUnaW0v34KK29-elmPGMvqLECeFydJc",
  authDomain: "langbridge-d048f.firebaseapp.com",
  projectId: "langbridge-d048f",
  storageBucket: "langbridge-d048f.firebasestorage.app",
  messagingSenderId: "390796304873",
  appId: "1:390796304873:web:7ea64809b91b4d3eaaab78",
  measurementId: "G-JPSRTVDSJR"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

