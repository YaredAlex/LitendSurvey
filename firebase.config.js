// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtvq3rJoMqA-YQeQfxFJr7bCtAyMvW83M",
  authDomain: "makingsom-f188e.firebaseapp.com",
  projectId: "makingsom-f188e",
  storageBucket: "makingsom-f188e.appspot.com",
  messagingSenderId: "623361946875",
  appId: "1:623361946875:web:8f82b9baee197d115f6c5e",
  measurementId: "G-XLX3L6YTZ9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
