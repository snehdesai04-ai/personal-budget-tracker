/*
  PERSONAL BUDGET TRACKER
  Built by: Sneh Desai
  -----------------------------------------------
  FILE 3 of 4: script.js
  This file contains ONLY the logic (JavaScript).
  Think of this as the brain of the app.

  JavaScript handles:
  - Storing data (transactions array)
  - Adding new transactions
  - Deleting transactions
  - Calculating totals
  - Updating what the user sees on screen
*/


// ==============================
// DATA STORAGE
// This array works like a database table in memory.
// Each item in the array = one row in the SQL table.
// In a real app this data would come from the SQL database (schema.sql)
// ==============================
let transactions = [];
let currentFilter = 'all'; // tracks which filter button is active
let nextId = 1;            // auto-increments like SQL's AUTO_INCREMENT


// ==============================
// ON PAGE LOAD
// Sets today's date in the date field automatically
// ==============================
document.getElementById('date').valueAsDate = new Date();


// ==============================
// ADD A TRANSACTION
// Called when user clicks the "Add Transaction" button
// SQL equivalent: INSERT INTO transactions VALUES (...)
// ==============================
function addTransaction() {

  // Step 1: Read values from the form fields
  const type     = document.querySelector('input[name="type"]:checked').value;
  const desc     = document.getElementById('desc').value.trim();
  const amount   = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date     = document.getElementById('date').value;

  // Step 2: Validate — make sure nothing is empty or invalid
  if (!desc)               { alert("Please enter a description."); return; }
  if (!amount || amount <= 0) { alert("Please enter a valid amount."); return; }
  if (!date)               { alert("Please select a date."); return; }

  // Step 3: Create a transaction object (like a row in a database table)
  const transaction = {
    id:       nextId++,   // unique ID, auto-increments
    type:     type,       // 'income' or 'expense'
    desc:     desc,       // description text
    amount:   amount,     // dollar amount
    category: category,   // selected category
    date:     date        // date string (YYYY-MM-DD)
  };

  // Step 4: Add it to our array
  // SQL: INSERT INTO transactions (type, desc, amount, category, date)
  //      VALUES ('income', 'SaskTel Salary', 2400.00, 'Salary', '2026-03-01');
  transactions.push(transaction);

  // Step 5: Refresh the display
  renderTransactions();
  updateSummary();
  showFlash();

  // Step 6: Clear the form fields so user can add another
  document.getElementById('desc').value      = '';
  document.getElementById('amount').value    = '';
  document.getElementById('date').valueAsDate = new Date();
}


// ==============================
// DELETE A TRANSACTION
// Called when user clicks the X button on a row
// SQL equivalent: DELETE FROM transactions WHERE id = ?
// ==============================
function deleteTransaction(id) {
  // filter() keeps every transaction EXCEPT the one with matching id
  transactions = transactions.filter(t => t.id !== id);
  renderTransactions();
  updateSummary();
}


// ==============================
// RENDER TRANSACTIONS TO THE SCREEN
// Reads the transactions array and builds HTML to display them
// SQL equivalent: SELECT * FROM transactions WHERE type = ? ORDER BY date DESC
// ==============================
function renderTransactions() {
  const list = document.getElementById('transaction-list');

  // Step 1: Apply filter (All / Income / Expenses)
  let filtered = transactions;
  if (currentFilter === 'income')  filtered = transactions.filter(t => t.type === 'income');
  if (currentFilter === 'expense') filtered = transactions.filter(t => t.type === 'expense');

  // Step 2: Sort newest date first
  filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Step 3: Show empty state if no results
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div>📭</div>
        No transactions yet.<br/>Add one using the form!
      </div>`;
    return;
  }

  // Step 4: Build HTML for each transaction and inject it into the page
  list.innerHTML = filtered.map(t => `
    <div class="transaction-item ${t.type}-item">
      <div class="t-info">
        <div class="t-desc">${t.desc}</div>
        <div class="t-meta">${t.category} · ${formatDate(t.date)}</div>
      </div>
      <div class="t-right">
        <div class="t-amount ${t.type}-amt">
          ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
        </div>
        <button class="delete-btn" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>
      </div>
    </div>
  `).join('');
}


// ==============================
// UPDATE SUMMARY CARDS
// Recalculates income, expenses, and balance
// SQL equivalent:
//   SELECT SUM(amount) FROM transactions WHERE type = 'income'
//   SELECT SUM(amount) FROM transactions WHERE type = 'expense'
// ==============================
function updateSummary() {

  // Add up all income amounts
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Add up all expense amounts
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Balance = income minus expenses
  const balance = totalIncome - totalExpense;

  // Update the 3 cards on screen
  document.getElementById('total-income').textContent  = `$${totalIncome.toFixed(2)}`;
  document.getElementById('total-expense').textContent = `$${totalExpense.toFixed(2)}`;
  document.getElementById('balance').textContent       = `$${balance.toFixed(2)}`;

  // Turn balance red if negative
  document.getElementById('balance').style.color = balance >= 0 ? '#1F4E79' : '#e74c3c';
}


// ==============================
// SET FILTER
// Called when user clicks All / Income / Expenses buttons
// ==============================
function setFilter(filter, btn) {
  currentFilter = filter;

  // Remove 'active' class from all buttons, then add to clicked one
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Re-render with new filter applied
  renderTransactions();
}


// ==============================
// FORMAT DATE
// Converts "2026-03-01" to "Mar 1, 2026" for display
// ==============================
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}


// ==============================
// FLASH NOTIFICATION
// Shows the green "Transaction added!" message briefly
// ==============================
function showFlash() {
  const f = document.getElementById('flash');
  f.style.display = 'block';
  setTimeout(() => f.style.display = 'none', 2000); // hides after 2 seconds
}


// ==============================
// SAMPLE DATA
// Pre-loads a few transactions so the app doesn't look empty on first open.
// In a real app this would come from a SQL database query.
// SQL: SELECT * FROM transactions ORDER BY date DESC
// ==============================
transactions = [
  { id: nextId++, type: 'income',  desc: 'SaskTel Salary',    amount: 2400.00, category: 'Salary',     date: '2026-03-01' },
  { id: nextId++, type: 'expense', desc: 'Monthly Rent',       amount: 900.00,  category: 'Rent',       date: '2026-03-01' },
  { id: nextId++, type: 'expense', desc: 'Groceries',          amount: 120.50,  category: 'Food',       date: '2026-03-02' },
  { id: nextId++, type: 'expense', desc: 'University Tuition', amount: 600.00,  category: 'Education',  date: '2026-03-03' },
  { id: nextId++, type: 'income',  desc: 'Freelance Project',  amount: 300.00,  category: 'Freelance',  date: '2026-03-04' },
];

// Run on page load to display the sample data
renderTransactions();
updateSummary();