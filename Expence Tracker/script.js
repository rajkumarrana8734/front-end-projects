
const form = document.querySelector('.container2');
const textInput = document.querySelector('input[type="text"]');
const amountInput = document.querySelector('input[type="number"]');
const typeSelect = document.querySelector('select');

const balanceEl = document.querySelector('.Balance');
const incomeEl = document.querySelector('.Income');
const expenseEl = document.querySelector('.Expence');

const listEl = document.getElementById('list');
const emptyEl = document.getElementById('empty');


let transactions = JSON.parse(localStorage.getItem('transactions')) || [];


function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


function updateValues() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(item => {
        if (item.type === 'Income') {
            totalIncome += item.amount;
        } else if (item.type === 'Expence') {
            totalExpense += item.amount;
        }
});

    const totalBalance = totalIncome - totalExpense;

    balanceEl.innerText = `₹${totalBalance}`;
    incomeEl.innerText = `₹${totalIncome}`;
    expenseEl.innerText = `₹${totalExpense}`;
}


function renderList() {
    listEl.innerHTML = '';

  
    if (transactions.length === 0) {
        emptyEl.style.display = 'block';
    } else {
        emptyEl.style.display = 'none';
    }

    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        
    
        const isIncome = transaction.type === 'Income';
        const sign = isIncome ? '+' : '-';
        const color = isIncome ? '#2ecc71' : '#e74c3c';

        li.style.borderBottom = '1px solid #2d3433'; 

        li.innerHTML = `
            <span>${transaction.text}</span>
            <span class="amt" style="color: ${color};">${sign}₹${transaction.amount}</span>
            <button onclick="deleteTransaction(${transaction.id})" style="cursor: pointer; border: none; color: #ff6b6b;" title="Delete">
                <i class="fa-solid fa-trash"></i> ✖
            </button>
        `;

        listEl.appendChild(li);
    });

    updateValues();
}


function addTransaction(e) {
    e.preventDefault(); 

    const text = textInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

  k
    if (text === '' || isNaN(amount) || amount <= 0 || type === 'Choose Balance type') {
        alert('fill the details');
        return;
    }

    const newTransaction = {
        id: Date.now(), // Unique ID
        text: text,
        amount: amount,
        type: type
    };

    transactions.push(newTransaction);
    updateLocalStorage();
    renderList();

  
    textInput.value = '';
    amountInput.value = '';
    typeSelect.selectedIndex = 0;
}


function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    updateLocalStorage();
    renderList();
}


form.addEventListener('submit', addTransaction);


renderList();