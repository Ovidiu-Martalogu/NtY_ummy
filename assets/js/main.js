
import { createForms } from './partials.js';

// Pt HTML
createForms('app');

const registerForm = document.querySelector('#registerForm');
const loginForm = document.querySelector('#loginForm');
const registerCard = document.querySelector('#registerCard');
const loginCard = document.querySelector('#loginCard');
const welcomeMessage = document.querySelector('#welcomeMessage');

function showWelcome(firstName, lastName) {
    registerCard.style.display = 'none';
    loginCard.style.display = 'none';
    welcomeMessage.style.display = 'block';
    welcomeMessage.textContent = `Bine ai venit, ${firstName} ${lastName}!`;
}

// --- FORM Inregistrare ---
registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(registerForm);
    const firstName = data.get('firstName').trim();
    const lastName = data.get('lastName').trim();
    const email = data.get('email').trim();
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const statusReg = document.querySelector('#statusReg');

    if (password !== confirmPassword) {
        statusReg.textContent = "Parolele nu se potrivesc!";
        statusReg.className = "status error";
        return;
    }

    const user = { firstName, lastName, email, password };

    try {
        const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (res.ok) {
            showWelcome(firstName, lastName);
        } else {
            throw new Error("Eroare la înregistrare");
        }
    } catch (err) {
        statusReg.textContent = "A apărut o eroare: " + err.message;
        statusReg.className = "status error";
    }
});

// --- FORM Autentificare ---
loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const data = new FormData(loginForm);
    const email = data.get('email').trim();
    const password = data.get('password');
    const statusLogin = document.querySelector('#statusLogin');

    try {
        //  POST for login
        const res = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error('Email sau parolă incorecte');

        const userData = await res.json();
        const token = userData.token; // token JWT primit de la backend

        if (token) {
            // Save token local pentru următoarele cereri
            localStorage.setItem('authToken', token);

            // Show wellcome msg
            showWelcome(userData.firstName, userData.lastName);

            statusLogin.textContent = '';
            statusLogin.className = '';
        } else {
            throw new Error('Token lipsă de la server');
        }

    } catch (err) {
        statusLogin.textContent = "Eroare: " + err.message;
        statusLogin.className = "status error";
    }
});

async function fetchProtectedData() {
    const token = localStorage.getItem('authToken'); // preluăm token-ul salvat
    const statusLogin = document.querySelector('#statusLogin');

    try {
        const res = await fetch('http://localhost:3000/users/me', {
            headers: {
                'Authorization': `Bearer ${token}` // trimitem token în header
            }
        });

        if (!res.ok) throw new Error('Nu ai acces sau token invalid');

        const data = await res.json();
        console.log('Date protejate:', data);
    } catch (err) {
        statusLogin.textContent = "Eroare: " + err.message;
        statusLogin.className = "status error";
    }
}
