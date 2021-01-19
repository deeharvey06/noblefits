import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMpJR-JkAFr0iHKH_GqnyPQMAV_YQs0Xw",
  authDomain: "noblefit-db.firebaseapp.com",
  projectId: "noblefit-db",
  storageBucket: "noblefit-db.appspot.com",
  messagingSenderId: "216957106939",
  appId: "1:216957106939:web:d58572a326a9e739e6ce5e",
  measurementId: "G-0KW67CNG82"
}

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;