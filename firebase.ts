// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDYr7eyP0gHDlsFY1eyyQrzRErbF13EZ4g",
	authDomain: "hinatazaka46-always-with-you.firebaseapp.com",
	projectId: "hinatazaka46-always-with-you",
	storageBucket: "hinatazaka46-always-with-you.appspot.com",
	messagingSenderId: "952723460602",
	appId: "1:952723460602:web:e8ff9738df9ac3e2881443",
	measurementId: "G-G16GB86PFD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const fireStorage = getStorage(app);
