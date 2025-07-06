import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const styleObj = {
  display: "block",
  margin: "40vh auto",
};

const firebaseConfig = {
  apiKey: "AIzaSyDILzZ5eQvfTgROoGrzwkqsy8WOxeTiqGg",
  authDomain: "docs--project.firebaseapp.com",
  projectId: "docs--project",
  storageBucket: "docs--project.appspot.com",
  messagingSenderId: "482729233000",
  appId: "1:482729233000:web:79b39acdc6f333a638c9dd",
  measurementId: "G-HR9ZTSXNNG",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
