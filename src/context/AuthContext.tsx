import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';


// Import auth and db from your App.tsx
// For now, we'll need to export them from a config file


interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {}
});


export const useAuth = () => useContext(AuthContext);


interface AuthProviderProps {
  children: ReactNode;
  auth: any; // We'll pass auth from App.tsx
  db: any;   // We'll pass db from App.tsx
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children, auth, db }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }


    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Auto-verify legacy users
        if (!currentUser.emailVerified) {
          try {
            const createdAt = currentUser.metadata.creationTime;
            const migrationCutoffDate = new Date('2026-01-29');
            const userCreatedDate = createdAt ? new Date(createdAt) : new Date();
           
            if (userCreatedDate < migrationCutoffDate) {
              console.log('🔄 Auto-verifying legacy user:', currentUser.email);
             
              try {
                await setDoc(doc(db, 'users', currentUser.uid), {
                  emailVerified: true,
                  migratedToEmailVerification: true,
                  migrationDate: serverTimestamp()
                }, { merge: true });
               
                console.log('✅ Legacy user auto-verified');
              } catch (firestoreErr) {
                console.warn('⚠️ Could not update Firestore, but allowing access anyway');
              }
             
              setUser(currentUser);
            } else {
              console.log('⚠️ New user needs email verification');
              setUser(null);
            }
          } catch (error) {
            console.error('Migration check failed:', error);
            setUser(currentUser);
          }
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });


    return () => unsubscribe();
  }, [auth, db]);


  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};