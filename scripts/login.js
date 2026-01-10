import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.getElementById("login-container");
  const registerContainer = document.getElementById("register-container");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
  });

  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const rememberMe = document.getElementById("remember-me").checked;

    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(window.auth, persistence);
      await signInWithEmailAndPassword(window.auth, email, password);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const confirmPassword = document
      .getElementById("confirm_password")
      .value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await setPersistence(window.auth, browserLocalPersistence);
      await createUserWithEmailAndPassword(window.auth, email, password);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.message);
    }
  });

});
