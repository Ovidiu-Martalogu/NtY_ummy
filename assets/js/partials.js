console.log(`loading partial js ....`);

export function createForms(containerId) {
    const container = document.querySelector(`#${containerId}`);

    // --- Card Înregistrare ---
    const registerCard = document.createElement('div');
    registerCard.classList.add('card');
    registerCard.id = 'registerCard';
    registerCard.innerHTML = `
        <h2>Înregistrează un cont</h2>
        <form id="registerForm"></form>
        <p id="statusReg" class="status"></p>
    `;

    const registerForm = registerCard.querySelector('#registerForm');

    const registerFields = [
        { placeholder: 'Prenume', name: 'firstName', type: 'text' },
        { placeholder: 'Nume', name: 'lastName', type: 'text' },
        { placeholder: 'Email', name: 'email', type: 'email' },
        { placeholder: 'Parola', name: 'password', type: 'password' },
        { placeholder: 'Confirmă parola', name: 'confirmPassword', type: 'password' }
    ];

    registerFields.forEach(f => {
        const div = document.createElement('div');
        div.classList.add('form-group');
        const input = document.createElement('input');
        input.type = f.type;
        input.placeholder = f.placeholder;
        input.name = f.name;
        input.required = true;
        div.appendChild(input);
        registerForm.appendChild(div);
    });

    const btnReg = document.createElement('button');
    btnReg.type = 'submit';
    btnReg.textContent = 'Înregistrează-te';
    registerForm.appendChild(btnReg);

    // --- Card Autentificare ---
    const loginCard = document.createElement('div');
    loginCard.classList.add('card');
    loginCard.id = 'loginCard';
    loginCard.innerHTML = `
        <h2>Autentificare</h2>
        <form id="loginForm"></form>
        <p id="statusLogin" class="status"></p>
    `;

    const loginForm = loginCard.querySelector('#loginForm');

    const loginFields = [
        { placeholder: 'Email', name: 'email', type: 'email' },
        { placeholder: 'Parola', name: 'password', type: 'password' }
    ];

    loginFields.forEach(f => {
        const div = document.createElement('div');
        div.classList.add('form-group');
        const input = document.createElement('input');
        input.type = f.type;
        input.placeholder = f.placeholder;
        input.name = f.name;
        input.required = true;
        div.appendChild(input);
        loginForm.appendChild(div);
    });

    const btnLogin = document.createElement('button');
    btnLogin.type = 'submit';
    btnLogin.textContent = 'Autentifică-te';
    loginForm.appendChild(btnLogin);

    // --- Mesaj bun venit ---
    const welcomeMessage = document.createElement('div');
    welcomeMessage.id = 'welcomeMessage';
    welcomeMessage.style.display = 'none';
    welcomeMessage.style.fontSize = '22px';
    welcomeMessage.style.fontWeight = 'bold';
    welcomeMessage.style.color = '#4CAF50';
    welcomeMessage.style.textAlign = 'center';

    // Adăugăm totul în container
    container.append(registerCard, loginCard, welcomeMessage);
}