// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0_hhgfgXXONq9JWtKBNvhZbRown5tckQ",
  authDomain: "bookylife-d3499.firebaseapp.com",
  projectId: "bookylife-d3499",
  storageBucket: "bookylife-d3499.firebasestorage.app",
  messagingSenderId: "992375258827",
  appId: "1:992375258827:web:4bd53b47bbd7abadc5e54e",
  measurementId: "G-X689WYFR6H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
