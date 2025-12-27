import { initializeApp, getApps, getApp } from 'firebase/app'; // Added these
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDoSFiSi518J9fIeRpPWCJNYcyiizW-siE',
  authDomain: 'prepwise-4aeeb.firebaseapp.com',
  projectId: 'prepwise-4aeeb',
  storageBucket: 'prepwise-4aeeb.firebasestorage.app',
  messagingSenderId: '385263592758',
  appId: '1:385263592758:web:164fa565e81c33b80ebf97',
  measurementId: 'G-5Z76V8QR0B',
};

// Fix: getApps() is a function call
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app); // Pass 'app' here as well
