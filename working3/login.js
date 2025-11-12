document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const guestLoginBtn = document.getElementById('guest-login');
    const errorMessage = document.getElementById('error-message');

    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
        errorMessage.textContent = '';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        errorMessage.textContent = '';
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const users = getUsers();

        if (users.find(user => user.username === username)) {
            errorMessage.textContent = 'username already exists';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = 'password must be at least 6 characters long';
            return;
        }

        users.push({ username, password });
        setUsers(users);
        
        localStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const users = getUsers();

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', username);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'invalid username or password';
        }
    });

    guestLoginBtn.addEventListener('click', () => {
        localStorage.setItem('currentUser', 'guest');
        window.location.href = 'index.html';
    });
});