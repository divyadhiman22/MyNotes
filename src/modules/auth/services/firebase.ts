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
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    localStorage.setItem('access_token', token);
    
    // Check if user document exists, create if it doesn't
    await createUserDocumentIfNotExists(result.user);
    
    return result;
  } catch (error) {
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