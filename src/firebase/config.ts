// src/firebase/config.ts
// Moved from App.tsx lines 391–561
// All `any` types replaced with proper Firebase types.
import { initializeApp }                  from 'firebase/app';
import { getAnalytics }                    from 'firebase/analytics';
import { getAuth }                         from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage }                      from 'firebase/storage';

import type { FirebaseApp }   from 'firebase/app';
import type { Analytics }     from 'firebase/analytics';
import type { Auth }          from 'firebase/auth';
import type { Firestore }     from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

// ── Config from Vite env vars ─────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (import.meta.env.DEV) {
  console.log('Environment check:', {
    hasApiKey:   !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    allViteKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
  });
}

// ── Typed exports (null when Firebase is not configured) ──
export let firebaseApp: FirebaseApp   | null = null;
export let analytics:   Analytics    | null = null;
export let auth:        Auth          | null = null;
export let db:          Firestore     | null = null;
export let storage:     FirebaseStorage | null = null;

const isMissingConfig = !firebaseConfig.apiKey || !firebaseConfig.projectId;

if (!isMissingConfig) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    analytics   = getAnalytics(firebaseApp);
    auth        = getAuth(firebaseApp);
    db          = getFirestore(firebaseApp);
    storage     = getStorage(firebaseApp);

    // Enable offline persistence (best-effort — ignores multi-tab / unsupported errors)
    enableIndexedDbPersistence(db).catch(err => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Offline persistence: multiple tabs open — only one tab benefits.');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Offline persistence: not supported by this browser.');
      } else {
        console.error('⚠️ Offline persistence error:', err);
      }
    });

    console.log('✅ Firebase initialised');
  } catch (err) {
    console.error('❌ Firebase initialisation failed:', err);
  }
} else {
  console.warn('⚠️ Firebase not configured — running in demo mode.');
  console.warn('Add VITE_FIREBASE_* vars to .env.local to enable Firebase.');
}

export const appId = firebaseConfig.appId;