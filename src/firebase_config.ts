// Packages
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config Chat Social
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAQYpfvd5D6ZqvdYqJ-hjqC9hP28_LjzaY",
  authDomain: "chat-socialcog.firebaseapp.com",
  projectId: "chat-socialcog",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
