const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const {
  getFirestore,
  doc,
  updateDoc,
  Timestamp,
} = require("firebase/firestore");

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
const db = getFirestore(app);

// Admin details - use the same email and password from before
const adminEmail = "admin@secureddocs.com";
const adminPassword = "admin123456";

async function updateAdminUser() {
  try {
    // Sign in with the admin credentials
    const userCredential = await signInWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );

    const user = userCredential.user;

    // Update admin data in Firestore with more complete fields
    const adminData = {
      firstName: "Admin",
      lastName: "User",
      contact: "1234567890",
      userType: "admin", // Make sure this is set to "admin"
      status: "active", // Make sure this is set to "active"
      updated_at: Timestamp.now(),
    };

    // Update admin data in Firestore
    await updateDoc(doc(db, "users", user.uid), adminData);

    console.log("Admin user updated successfully!");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log(
      "IMPORTANT: Make sure to use the ADMIN login page at /adminlogin to log in"
    );
  } catch (error) {
    console.error("Error updating admin user:", error);
  }
}

// Execute the function
updateAdminUser();
