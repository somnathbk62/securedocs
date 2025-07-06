const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc, Timestamp } = require("firebase/firestore");

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

// Admin details - you can change these as needed
const adminEmail = "admin@secureddocs.com";
const adminPassword = "admin123456"; // Make sure it's at least 6 characters

async function createAdminUser() {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );
    
    const user = userCredential.user;
    
    // Add admin data to Firestore
    const adminData = {
      email: adminEmail,
      password: adminPassword, // Note: Storing password in plaintext is not recommended for production
      userType: "admin",
      uid: user.uid,
      status: "active",
      created_at: Timestamp.now(),
    };
    
    // Save admin data to Firestore
    await setDoc(doc(db, "users", user.uid), adminData);
    
    console.log("Admin user created successfully!");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    
  } catch (error) {
    console.error("Error creating admin user:", error);
    if (error.code === "auth/email-already-in-use") {
      console.log("This email is already in use. Try a different email or reset the password for this account.");
    }
  }
}

// Execute the function
createAdminUser();
