import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';


export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<User> {
    if (!auth) throw new Error('Auth not initialized');
   
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }


  /**
   * Create a new user account
   */
  static async signUp(email: string, password: string, displayName: string): Promise<User> {
    if (!auth) throw new Error('Auth not initialized');
   
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
   
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
   
    return userCredential.user;
  }


  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    if (!auth) throw new Error('Auth not initialized');
    await signOut(auth);
  }


  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    if (!auth) throw new Error('Auth not initialized');
    await sendPasswordResetEmail(auth, email);
  }


  /**
   * Update user profile
   */
  static async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    if (!auth || !auth.currentUser) throw new Error('No authenticated user');
    await updateProfile(auth.currentUser, updates);
  }


  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    return auth?.currentUser || null;
  }
}

