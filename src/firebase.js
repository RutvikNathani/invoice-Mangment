
import { initializeApp } from "firebase/app";
import  {getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage"; // Import for storage
import { getFirestore } from "firebase/firestore"; // Import for Firestore



const firebaseConfig = {
  apiKey: "AIzaSyD2_l-XFX1Jm-toxPzngP4CVPLYkaBpRuQ",
  authDomain: "invoice-10cb1.firebaseapp.com",
  projectId: "invoice-10cb1",
  storageBucket: "invoice-10cb1.firebasestorage.app",
  messagingSenderId: "999341556782",
  appId: "1:999341556782:web:216aefab1c9f1718a7cbbf",
  measurementId: "G-TGSG15GB29"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app);

// dta1z9pg5
// 487947863589535
// l6ytRB1jweCI86a92t3ic474K60
// CLOUDINARY_URL=cloudinary://487947863589535:l6ytRB1jweCI86a92t3ic474K60@dta1z9pg5