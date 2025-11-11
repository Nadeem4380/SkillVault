// frontend/src/js/auth.js

const apiUrl = 'http://localhost:5000/api'; // Update with your backend API URL

// Function to handle user login
async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
    } else {
        alert(data.message);
    }
}

// Function to handle user signup
async function signupUser(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Signup successful! Please log in.');
        window.location.href = 'login.html';
    } else {
        alert(data.message);
    }
}

// Function to handle logout
function logoutUser() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Event listeners for login and signup forms
document.getElementById('login-form').addEventListener('submit', loginUser);
document.getElementById('signup-form').addEventListener('submit', signupUser);