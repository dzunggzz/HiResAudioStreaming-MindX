import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCvOMaghra_ilGnZ7KR5w-IzDcV_w2BRVU",
  authDomain: "hras-jsi36.firebaseapp.com",
  projectId: "hras-jsi36",
  storageBucket: "hras-jsi36.firebasestorage.app",
  messagingSenderId: "728168542406",
  appId: "1:728168542406:web:1a8ed08ffa297366bfa7c7",
  measurementId: "G-K321YJ4PNQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.auth = auth;
window.db = db;