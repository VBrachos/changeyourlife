// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBfRc5Fz3XqMlY5p3KOrOByVSOGKRRER9U",
  authDomain: "changelife-dd016.firebaseapp.com",
  projectId: "changelife-dd016",
  storageBucket: "changelife-dd016.firebasestorage.app",
  messagingSenderId: "949721110140",
  appId: "1:949721110140:web:3febb0666b0f9d90ae9bf9",
  measurementId: "G-4GM38ZBY2M"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };