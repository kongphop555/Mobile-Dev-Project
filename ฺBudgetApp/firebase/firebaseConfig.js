// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqhAt5XllsfGcFnzHOzXDaiEtPq0Cz_zE",
  authDomain: "your-auth-domain",
  projectId: "ww-8082d",
  storageBucket: "ww-8082d.firebasestorage.app",
  messagingSenderId: "your-messaging-sender-id",
  appId: "1:410780487079:android:94e073a8d57c862048fa82"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
export const db = getFirestore(app);