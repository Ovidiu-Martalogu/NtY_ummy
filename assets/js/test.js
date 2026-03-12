console.log(`loading ..`);

// async function getResource() {
//     try {

//         const response = await fetch("http://localhost:3000/payments");
//         console.log(response);

//         const data = await response.json();
//         console.log(data);

//         });

//     } catch (error) {
//         console.error(error);
//     }
// }

// getResource();


const API = "http://localhost:3000/payments";
let currentUser = null; // va stoca user-ul logat

const table = document.getElementById("paymentsTable");

// --- Load Payments pentru user logat ---
async function loadPayments() {
    if (!currentUser) return;

    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Eroare la încărcarea plăților");
        const data = await res.json();

        // filtrăm doar plățile utilizatorului curent
        const userPayments = data.filter(p => p.userId === currentUser.id);

        table.innerHTML = "";

        if (userPayments.length === 0) {
            table.innerHTML = `<tr><td colspan="5">Nu ai plăți înregistrate.</td></tr>`;
            return;
        }

        userPayments.forEach((p, index) => {
            const id = p.id ?? index + 1;
            table.innerHTML += `
                <tr>
                    <td>${p.date}</td>
                    <td>${p.amount}</td>
                    <td>${p.categoryId}</td>
                    <td>${p.userId}</td>
                    <td>
                        <button onclick="editPayment(${id})">Edit</button>
                        <button onclick="deletePayment(${id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("LoadPayments error:", error);
        table.innerHTML = `<tr><td colspan="5">Nu s-au putut încărca plățile.</td></tr>`;
    }
}

// --- Add Payment ---
async function addPayment(e) {
    e.preventDefault();
    if (!currentUser) return alert("Trebuie să fii autentificat!");

    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Eroare la preluarea plăților pentru calcul ID");
        const data = await res.json();

        const newId = data.length + 1;

        const payment = {
            id: newId,
            date: document.getElementById("date").value,
            amount: Number(document.getElementById("amount").value),
            categoryId: Number(document.getElementById("categoryId").value),
            userId: currentUser.id
        };

        const resPost = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payment)
        });
        if (!resPost.ok) throw new Error("Eroare la adăugarea plății");

        document.getElementById("paymentForm").reset();
        loadPayments();

    } catch (error) {
        console.error("AddPayment error:", error);
        alert("Nu s-a putut adăuga plata.");
    }
}

// --- Edit Payment ---
async function editPayment(id) {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Eroare la preluarea plății");
        const payment = await res.json();

        if (payment.userId !== currentUser.id) return alert("Nu poți modifica plata altui utilizator!");

        const newAmount = prompt("New amount", payment.amount);
        if (!newAmount) return;

        const resPatch = await fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: Number(newAmount) })
        });
        if (!resPatch.ok) throw new Error("Eroare la actualizarea plății");

        loadPayments();

    } catch (error) {
        console.error("EditPayment error:", error);
        alert("Nu s-a putut actualiza plata.");
    }
}

// --- Delete Payment ---
async function deletePayment(id) {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Eroare la preluarea plății");
        const payment = await res.json();

        if (payment.userId !== currentUser.id) return alert("Nu poți șterge plata altui utilizator!");

        const resDel = await fetch(`${API}/${id}`, { method: "DELETE" });
        if (!resDel.ok) throw new Error("Eroare la ștergerea plății");

        loadPayments();

    } catch (error) {
        console.error("DeletePayment error:", error);
        alert("Nu s-a putut șterge plata.");
    }
}

// --- Login simplu ---
async function login(email, password) {
    try {
        // 1️ Cerere POST la backend
        const res = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error("Email sau parolă incorecte");

        const userData = await res.json();
        const token = userData.token;

        if (!token) throw new Error("Token lipsă de la server");

        // 2️.Salvăm token-ul pentru rute protejate
        localStorage.setItem('authToken', token);

        // 3.Memorăm user-ul logat
        currentUser = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        };

        alert(`Bine ai venit, ${currentUser.firstName} ${currentUser.lastName}!`);

        // Încarcăm date protejate (ex: plăți)
        loadPayments();

    } catch (error) {
        console.error("Login error:", error);
        alert("Nu s-a putut autentifica: " + error.message);
    }
}

// --- Event listener formular adăugare ---
document.getElementById("paymentForm").addEventListener("submit", addPayment);