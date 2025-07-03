import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // Added isSupported
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9OAkJoPETaQde2WOqtHC8ZDKNiu7JGUE",
  authDomain: "markabhub.firebaseapp.com",
  projectId: "markabhub",
  storageBucket: "markabhub.appspot.com",
  messagingSenderId: "1047775084687",
  appId: "1:1047775084687:web:6fdece08d004e67275b0fa",
  measurementId: "G-D8SC18C4P3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only if supported
let analytics;
isSupported().then((supported) => {
  if (supported) analytics = getAnalytics(app);
});

// Initialize Storage
export const storage = getStorage(app);

// Optional: Initialize other services as needed
// import { getFirestore } from "firebase/firestore";
// export const db = getFirestore(app);