// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot 
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC11a5YqlpWCrIrNgM26qQmXedC-7erfEc",
  authDomain: "soup-97c76.firebaseapp.com",
  projectId: "soup-97c76",
  storageBucket: "soup-97c76.firebasestorage.app",
  messagingSenderId: "1076262381764",
  appId: "1:1076262381764:web:9876ea91c1d12bf5910191",
  measurementId: "G-WTHL9Y1JG8"
};

// Initialize Firebase Core
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics conditionally
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// ==========================================
// Authentication Helpers (Email/Password)
// ==========================================

export async function signUpWithEmail(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}

export async function signInWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signOutUser() {
  await signOut(auth);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ==========================================
// Firestore Database Helpers
// ==========================================

export async function saveFounderProfile(uid, profileData) {
  if (!uid) return;
  const docRef = doc(db, 'founders', uid);
  await setDoc(docRef, {
    ...profileData,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

export async function getFounderProfile(uid) {
  if (!uid) return null;
  const docRef = doc(db, 'founders', uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

export async function saveContentStudioItems(uid, items) {
  if (!uid) return;
  const docRef = doc(db, 'founders', uid, 'workspace', 'studio');
  await setDoc(docRef, { items, updatedAt: new Date().toISOString() });
}

export async function saveAgentMemoryItems(uid, memory) {
  if (!uid) return;
  const docRef = doc(db, 'founders', uid, 'workspace', 'memory');
  await setDoc(docRef, { memory, updatedAt: new Date().toISOString() });
}
