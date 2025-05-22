// src/modules/auth/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, getUserDocument } from "@/modules/auth/services/firebase";
// import { auth, getUserDocument } from "../services/firebase";

// Define the expected shape of the user document
interface UserDocument {
  id: string;
  displayName?: string;
  photoURL?: string;
  // Add other properties as needed
}

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: User | null) => {
        if (user) {
          // User is signed in
          try {
            const userDoc = await getUserDocument(user.uid) as UserDocument;
            setAuthState({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userDoc?.displayName || null,
                photoURL: user.photoURL || userDoc?.photoURL || null
              },
              loading: false,
              error: null
            });
          } catch (error) {
            setAuthState({
              user: null,
              loading: false,
              error: error as Error
            });
          }
        } else {
          // User is signed out
          setAuthState({
            user: null,
            loading: false,
            error: null
          });
        }
      },
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error as Error
        });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return authState;
};