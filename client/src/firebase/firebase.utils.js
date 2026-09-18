import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { firebaseConfig } from "../config/clientConfig";

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return null;

  const userRef = doc(firestore, "users", userAuth.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email } = userAuth;
    await setDoc(userRef, {
      displayName,
      email,
      createdAt: serverTimestamp(),
      ...additionalData,
    });
  }

  return userRef;
};

export const getUserProfileSnapshot = async (userAuth, additionalData) => {
  const userRef = await createUserProfileDocument(userAuth, additionalData);
  return userRef ? getDoc(userRef) : null;
};

export const convertCollectionsSnapshotToMap = (collectionsSnapshot) => {
  const transformedCollections = collectionsSnapshot.docs
    .map((collectionDoc) => {
      const data = collectionDoc.data();
      const title = typeof data?.title === "string" ? data.title.trim() : "";
      const items = Array.isArray(data?.items) ? data.items : [];

      if (!title) return null;

      return {
        routeName: encodeURIComponent(title.toLowerCase()),
        id: collectionDoc.id,
        title,
        items,
      };
    })
    .filter(Boolean);

  return transformedCollections.reduce((accumulator, currentCollection) => {
    accumulator[currentCollection.title.toLowerCase()] = currentCollection;
    return accumulator;
  }, {});
};

export const fetchCollections = async () => {
  const snapshot = await getDocs(collection(firestore, "collections"));
  return convertCollectionsSnapshotToMap(snapshot);
};

export const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    let unsubscribe = () => {};
    unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      (error) => {
        unsubscribe();
        reject(error);
      },
    );
  });

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
export const signOutUser = () => signOut(auth);
export const sendPasswordReset = (email) => sendPasswordResetEmail(auth, email);
export const createAuthUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
