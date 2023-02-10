import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from '@firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD9b2gnakRWkawDZVCKZeY8DwAcjx0o3sw",
  authDomain: "power-fuel-22963.firebaseapp.com",
  projectId: "power-fuel-22963",
  storageBucket: "power-fuel-22963.appspot.com",
  messagingSenderId: "591900029661",
  appId: "1:591900029661:web:5dddd4018e731ed9ff6134",
  measurementId: "G-EST510DJ4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app;
