const API_URL = 'http://localhost:3000/expenses';

const form = document.getElementById('expense-form');
const tableBody = document.querySelector('#expense-table tbody');
const totalCell = document.getElementById('total');
const expenseIdInput = document.getElementById('expense-id');
const cancelEditBtn = document.getElementById('cancel-edit');

const searchInput = document.getElementById('search-text');
const minAmountInput = document.getElementById('min-amount');
const maxAmountInput = document.getElementById('max-amount');
const applyFilterBtn = document.getElementById('apply-filter');
const resetFilterBtn = document.getElementById('reset-filter');

let expensesCache = []; // salvăm toate cheltuielile pentru filtrare locală

// Încarcă cheltuielile de la server
async function loadExpenses() {
    const res = await fetch(API_URL);
    const expenses = await res.json();
    expensesCache = expenses; // cache pentru filtre
    renderTable(expenses);
}

function renderTable(expenses) {
    tableBody.innerHTML = '';
    let total = 0;

    expenses.forEach(expense => {
        const row = document.createElement('tr');

        const descCell = document.createElement('td');
        descCell.textContent = expense.description;

        const amountCell = document.createElement('td');
        amountCell.textContent = parseFloat(expense.amount).toFixed(2);

        const actionCell = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editează';
        editBtn.addEventListener('click', () => startEdit(expense));
        actionCell.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Șterge';
        deleteBtn.style.marginLeft = '5px';
        deleteBtn.addEventListener('click', async () => {
            await fetch(`${API_URL}/${expense.id}`, { method: 'DELETE' });
            loadExpenses();
        });
        actionCell.appendChild(deleteBtn);

        row.appendChild(descCell);
        row.appendChild(amountCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);

        total += parseFloat(expense.amount);
    });

    totalCell.textContent = total.toFixed(2);
}

// Începe editarea unei cheltuieli
function startEdit(expense) {
    expenseIdInput.value = expense.id;
    document.getElementById('description').value = expense.description;
    document.getElementById('amount').value = expense.amount;
    form.querySelector('button[type="submit"]').textContent = 'Salvează';
    cancelEditBtn.style.display = 'inline';
}

// Anulează editarea
cancelEditBtn.addEventListener('click', () => {
    expenseIdInput.value = '';
    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'Adaugă / Salvează';
    cancelEditBtn.style.display = 'none';
});

// Form submit (CREATE sau UPDATE)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = expenseIdInput.value;
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    if (!description || amount <= 0) return;

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, amount })
        });
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, amount })
        });
    }

    cancelEditBtn.click();
    loadExpenses();
});

// Aplică filtrul local
applyFilterBtn.addEventListener('click', () => {
    let filtered = expensesCache;

    const text = searchInput.value.trim().toLowerCase();
    const minAmount = parseFloat(minAmountInput.value);
    const maxAmount = parseFloat(maxAmountInput.value);

    if (text) filtered = filtered.filter(e => e.description.toLowerCase().includes(text));
    if (!isNaN(minAmount)) filtered = filtered.filter(e => e.amount >= minAmount);
    if (!isNaN(maxAmount)) filtered = filtered.filter(e => e.amount <= maxAmount);

    renderTable(filtered);
});

// Resetează filtrul
resetFilterBtn.addEventListener('click', () => {
    searchInput.value = '';
    minAmountInput.value = '';
    maxAmountInput.value = '';
    renderTable(expensesCache);
});

loadExpenses();