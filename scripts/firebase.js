import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAURGfZssr80iaRP0LMd_XU4zn5pXdS8gs",
  authDomain: "hras-jsi36-new.firebaseapp.com",
  projectId: "hras-jsi36-new",
  storageBucket: "hras-jsi36-new.firebasestorage.app",
  messagingSenderId: "772387719992",
  appId: "1:772387719992:web:b1c713c5a178942883cfcd",
  measurementId: "G-VJPKELEDZ9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.auth = auth;
window.db = db;