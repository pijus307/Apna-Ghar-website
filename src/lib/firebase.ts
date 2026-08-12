import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Booking } from '../types';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Auth helper functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create/update user document
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Homeowner',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
      });
    }
    return user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  return signOut(auth);
};

// Firestore helper functions for Bookings
export const subscribeToUserBookings = (
  userId: string,
  callback: (bookings: Booking[]) => void
) => {
  const bookingsRef = collection(db, 'users', userId, 'bookings');
  return onSnapshot(bookingsRef, (snapshot) => {
    const bookingsList: Booking[] = [];
    snapshot.forEach((docSnap) => {
      bookingsList.push(docSnap.data() as Booking);
    });
    // Sort by createdAt descending
    bookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(bookingsList);
  }, (error) => {
    console.error('Error listening to bookings:', error);
  });
};

export const saveBookingToFirestore = async (userId: string, booking: Booking) => {
  const bookingRef = doc(db, 'users', userId, 'bookings', booking.id);
  await setDoc(bookingRef, booking);
};

export const updateBookingStatusInFirestore = async (
  userId: string,
  bookingId: string,
  newStatus: Booking['status']
) => {
  const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
  await updateDoc(bookingRef, { status: newStatus });
};

// Firestore helper for partner applications
export const savePartnerApplication = async (appData: {
  fullName: string;
  phone: string;
  trade: string;
  experienceYears: string;
  city: string;
  userId?: string;
}) => {
  const colRef = collection(db, 'partnerApplications');
  await addDoc(colRef, {
    ...appData,
    createdAt: new Date().toISOString(),
  });
};
