/* import firebase from "firebase/app"; */
import "firebase/auth";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyA4simi1_MVRtGUo2_puPO1dnhBw0CFiUg",
  authDomain: "voipan-bbf4b.firebaseapp.com",
  projectId: "voipan-bbf4b",
  storageBucket: "voipan-bbf4b.appspot.com",
  messagingSenderId: "737185150350",
  appId: "1:737185150350:web:7cba2d2ec5f625b76620df",
  measurementId: "G-NRBR3NTNC7",
});

// Initialize Firebase
export const auth = getAuth(app);
export default app;

export const db = getFirestore(app);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Analytics
// export const analytics = getAnalytics(app);
