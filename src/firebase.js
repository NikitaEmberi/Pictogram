// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDgg1mKFDkpsCylAvqz4WJD8W1lOnlMmTo",
//   authDomain: "instagram-clone-354a3.firebaseapp.com",
//   projectId: "instagram-clone-354a3",
//   storageBucket: "instagram-clone-354a3.appspot.com",
//   messagingSenderId: "215928978336",
//   appId: "1:215928978336:web:bf15c8cbdfe556498682c5",
//   measurementId: "G-GSSE9FFZFY"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDgg1mKFDkpsCylAvqz4WJD8W1lOnlMmTo",
    authDomain: "instagram-clone-354a3.firebaseapp.com",
    projectId: "instagram-clone-354a3",
    storageBucket: "instagram-clone-354a3.appspot.com",
    messagingSenderId: "215928978336",
    appId: "1:215928978336:web:bf15c8cbdfe556498682c5",
    measurementId: "G-GSSE9FFZFY"  
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const { FieldValue } = firebase.firestore;

export { db, auth, storage, FieldValue }
