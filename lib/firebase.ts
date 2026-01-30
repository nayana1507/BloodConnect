import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDAbdWo3M7-0_29s56paHyIVURbdKu0lw4",
  authDomain: "bloodconnect-60b25.firebaseapp.com",
  projectId: "bloodconnect-60b25",
  storageBucket: "bloodconnect-60b25.firebasestorage.app",
  messagingSenderId: "418342006124",
  appId: "1:418342006124:web:708496185e34196d405749"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
