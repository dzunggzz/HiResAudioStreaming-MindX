import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const forgotForm = document.getElementById("forgot-form");

    forgotForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("forgot-email").value.trim();

        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        try {
            await sendPasswordResetEmail(window.auth, email);
            alert("Password reset email sent! Please check your inbox.");
            window.location.href = "./login.html";
        } catch (error) {
            console.error("Error sending password reset email:", error);
            let errorMessage = "Failed to send password reset email. Please try again.";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email address.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address.";
            }
            alert(errorMessage);
        }
    });
});
