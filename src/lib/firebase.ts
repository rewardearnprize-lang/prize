// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ أضفنا Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvX_32pzswdpYGtZlDCZC143A7zqxPDIo",
  authDomain: "fir-project-b3e4e.firebaseapp.com",
  databaseURL: "https://fir-project-b3e4e-default-rtdb.firebaseio.com",
  projectId: "fir-project-b3e4e",
  storageBucket: "fir-project-b3e4e.appspot.com", // ✅ عدلتها عشان تبقى الصيغة الصح
  messagingSenderId: "51930188050",
  appId: "1:51930188050:web:21a1c483b3a302a2d84bcb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const database = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app); // ✅ أهو الاستورج الجديد

export default app;
