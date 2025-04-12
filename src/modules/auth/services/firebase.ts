/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
// src/modules/auth/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc 
} from 'firebase/firestore';
import { firebaseConfig } from '../../../shared/config/firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Firebase Authentication Methods
// For Signup
export const signUpWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Signup error details:", error);
    throw error;
  }
};

// For Login
export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('access_token', token);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Signing in with Google
export const signInWithGoogle = async () => {
  try {
    // Force Google to prompt the user to select an account
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google sign-in result:", result);
    
    const token = await result.user.getIdToken();
    localStorage.setItem('access_token', token);
    
    console.log("Token stored, creating user document if needed...");
    // Check if user document exists, create if it doesn't
    const userDoc = await createUserDocumentIfNotExists(result.user);
    console.log("User document status:", userDoc);
    
    return result;
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    // Handle specific error codes
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in window was closed. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Pop-up was blocked by your browser. Please enable pop-ups for this site.');
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('access_token');
  } catch (error) {
    throw error;
  }
};

// Firestore Methods
export const createUserDocumentIfNotExists = async (user: any) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error; // Throw error to handle it in calling function
    }
  }
  
  return getUserDocument(user.uid);
};

export const getUserDocument = async (uid: string) => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    throw error; // Throw error to handle it in calling function
  }
  
  return null;
};

export const updateUserDocument = async (uid: string, data: any) => {
  if (!uid) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
    return getUserDocument(uid);
  } catch (error) {
    console.error("Error updating user document:", error);
    throw error;
  }
};

// Add subcollection data for a user
export const addUserData = async (uid: string, collectionName: string, data: any) => {
  if (!uid) return;
  
  try {
    const userCollectionRef = collection(db, 'users', uid, collectionName);
    const docRef = await addDoc(userCollectionRef, {
      ...data,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding ${collectionName} to user:`, error);
    throw error;
  }
};