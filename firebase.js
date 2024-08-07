// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCODSeS4Hf4OYldZ9I9hxP5A97Hu4aDUaY",
  authDomain: "inventory-management-d5852.firebaseapp.com",
  projectId: "inventory-management-d5852",
  storageBucket: "inventory-management-d5852.appspot.com",
  messagingSenderId: "68903210520",
  appId: "1:68903210520:web:34a3ad5936101d8a24fd6d",
  measurementId: "G-RLV2FG41CM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}