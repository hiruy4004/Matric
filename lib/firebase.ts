import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.AIzaSyCD4KbF1M-6PcRWIS1twbL3_5Yxq1AOxvA,
  authDomain: process.env.matric-31f80.firebaseapp.com,
  projectId: process.env.matric-31f80,
  storageBucket: process.env.matric-31f80.firebasestorage.app,
  messagingSenderId: process.env.953852984039,
  appId: process.env.1:953852984039:web:da37e330303ccb4fac0042,
  measurementId: process.env.G-2NNZXW3KVL
};
// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];