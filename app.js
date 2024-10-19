const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmountDisplay = document.getElementById('total-amount');


let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let isEditing = false;
let editExpenseId = null;


document.addEventListener('DOMContentLoaded', () => {
    displayExpenses();
    updateTotal();
});


expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;  

    if (name && amount && category && date) {
        if (isEditing) {
            
            updateExpense(editExpenseId, name, amount, category, date);
        } else {
            
            const newExpense = { id: Date.now(), name, amount, category, date };  
            expenses.push(newExpense);
        }
        saveExpenses();  
        displayExpenses();
        updateTotal();  
        expenseForm.reset();  
        isEditing = false;  
        editExpenseId = null;
        document.getElementById('submit-btn').textContent = "Add Expense";  
    }
});


function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}


function displayExpenses() {
    expenseList.innerHTML = '';  
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name} - ${expense.amount.toFixed(2)} <strong>[${expense.category}]</strong> on ${expense.date}  
            <div class= 'buttons'>
            <button class="edit-btn" onclick="editExpense(${expense.id})">Edit</button>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        `;
        expenseList.appendChild(li);  
    });
}


function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountDisplay.textContent = total.toFixed(2);  
}


function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);  
    saveExpenses();
    displayExpenses();  
    updateTotal();  
}

function editExpense(id) {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    document.getElementById('expense-name').value = expenseToEdit.name;
    document.getElementById('expense-amount').value = expenseToEdit.amount;
    document.getElementById('expense-category').value = expenseToEdit.category;
    document.getElementById('expense-date').value = expenseToEdit.date;  

    isEditing = true;
    editExpenseId = id;

    document.getElementById('submit-btn').textContent = "Update Expense"; 
}


function updateExpense(id, name, amount, category, date) {
    expenses = expenses.map(expense => {
        if (expense.id === id) {
            return { ...expense, name, amount, category, date };  
        }
        return expense;
    });
    saveExpenses(); 
}
