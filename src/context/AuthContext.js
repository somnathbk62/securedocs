import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user data from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data();
            setUserData(userDataFromFirestore);
            
            // Store user type in session storage for easy access
            sessionStorage.setItem("userType", userDataFromFirestore.userType);
            sessionStorage.setItem("isLogin", "true");
            sessionStorage.setItem("id", user.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
        sessionStorage.removeItem("userType");
        sessionStorage.removeItem("isLogin");
        sessionStorage.removeItem("id");
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Student login function
  async function studentLogin(email, password, rememberMe = false) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set persistence based on rememberMe option
      if (rememberMe) {
        // This is handled by Firebase Auth automatically
        // We could use setPersistence if needed
      }
      
      // Check if user is a student and active
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.userType === "student" && userData.status === "active") {
          toast.success("Login Successful", {
            position: "top-center",
          });
          return { success: true, userData };
        } else {
          await signOut(auth);
          throw new Error("Access Denied: You are not supposed to access this panel");
        }
      } else {
        await signOut(auth);
        throw new Error("User data not found");
      }
    } catch (error) {
      let errorMessage = "Invalid Credentials";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      throw new Error(errorMessage);
    }
  }

  // Admin login function
  async function adminLogin(email, password, rememberMe = false) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is an admin
      const userRef = collection(db, "users");
      const q = query(userRef, where("uid", "==", user.uid));
      
      return new Promise((resolve, reject) => {
        onSnapshot(q, (querySnapshot) => {
          const userData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))[0];
          
          if (userData && userData.userType === "admin") {
            toast.success("Welcome Admin", {
              position: "top-center",
            });
            resolve({ success: true, userData });
          } else {
            signOut(auth);
            reject(new Error("Access Denied: Not an Admin"));
          }
        }, (error) => {
          reject(error);
        });
      });
    } catch (error) {
      let errorMessage = "Invalid Credentials";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      throw new Error(errorMessage);
    }
  }

  // Logout function
  async function logout() {
    try {
      await signOut(auth);
      toast.success("Logged out successfully", {
        position: "top-center",
      });
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out", {
        position: "top-center",
      });
      return false;
    }
  }

  // Password reset function
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.", {
        position: "top-center",
      });
      return true;
    } catch (error) {
      let errorMessage = "Failed to send password reset email";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No user found with this email address";
      }
      
      toast.error(errorMessage, {
        position: "top-center",
      });
      throw new Error(errorMessage);
    }
  }

  // Check if user is admin
  function isAdmin() {
    return userData && userData.userType === "admin";
  }

  // Check if user is student
  function isStudent() {
    return userData && userData.userType === "student" && userData.status === "active";
  }

  const value = {
    currentUser,
    userData,
    loading,
    studentLogin,
    adminLogin,
    logout,
    resetPassword,
    isAdmin,
    isStudent
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
