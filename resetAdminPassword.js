const { initializeApp } = require("firebase/app");
const { getAuth, sendPasswordResetEmail } = require("firebase/auth");

// Firebase configuration from your Firebase.js file
const firebaseConfig = {
  apiKey: "AIzaSyDILzZ5eQvfTgROoGrzwkqsy8WOxeTiqGg",
  authDomain: "docs--project.firebaseapp.com",
  projectId: "docs--project",
  storageBucket: "docs--project.appspot.com",
  messagingSenderId: "482729233000",
  appId: "1:482729233000:web:79b39acdc6f333a638c9dd",
  measurementId: "G-HR9ZTSXNNG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Replace with the admin email you want to reset
const adminEmail = "admin@example.com"; // Change this to your admin email

async function resetAdminPassword() {
  try {
    await sendPasswordResetEmail(auth, adminEmail);
    console.log(`Password reset email sent to ${adminEmail}`);
    console.log("Check your email and follow the instructions to reset your password.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    if (error.code === "auth/user-not-found") {
      console.log("No user found with this email address.");
    }
  }
}

// Execute the function
resetAdminPassword();
