// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRd1SbkCL2NgVemakRs5h9N54GqRaWduA",
  authDomain: "ai-travel-planner-28718.firebaseapp.com",
  projectId: "ai-travel-planner-28718",
  storageBucket: "ai-travel-planner-28718.firebasestorage.app",
  messagingSenderId: "147797622247",
  appId: "1:147797622247:web:0429b5e6da8c423d011142",
  measurementId: "G-5JXNTKEK6X"
};  

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const db= getFirestore(app);
// const analytics = getAnalytics(app);