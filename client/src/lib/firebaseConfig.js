// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAX01a0nnhKNnlKswlG35iOt86k3AFHnms",
  authDomain: "loginmern-53e3b.firebaseapp.com",
  projectId: "loginmern-53e3b",
  storageBucket: "loginmern-53e3b.firebasestorage.app",
  messagingSenderId: "772767093873",
  appId: "1:772767093873:web:5b9868176addc452cd37d0",
  measurementId: "G-2NGFT46K9T",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
