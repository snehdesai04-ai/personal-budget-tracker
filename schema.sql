-- ================================================
-- PERSONAL BUDGET TRACKER
-- Built by: Sneh Desai
-- ------------------------------------------------
-- FILE 4 of 4: schema.sql
-- This file contains the DATABASE DESIGN (SQL).
-- Think of this as the filing cabinet that stores all data.
--
-- In a real application, this runs on a server (e.g. MySQL).
-- The JavaScript (script.js) would talk to this database
-- instead of storing data in memory.
-- ================================================


-- ------------------------------------------------
-- STEP 1: CREATE THE DATABASE
-- Like creating a new filing cabinet
-- ------------------------------------------------
CREATE DATABASE IF NOT EXISTS budget_tracker;
USE budget_tracker;


-- ------------------------------------------------
-- STEP 2: CREATE THE TRANSACTIONS TABLE
-- Like designing the form/template for each record
-- Each column = one piece of information per transaction
-- ------------------------------------------------
CREATE TABLE transactions (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    -- AUTO_INCREMENT means SQL automatically assigns 1, 2, 3... like nextId in script.js

    type        ENUM('income', 'expense') NOT NULL,
    -- ENUM means only these two values are allowed
    -- NOT NULL means this field is required (cannot be empty)

    description VARCHAR(100) NOT NULL,
    -- VARCHAR(100) = text up to 100 characters

    amount      DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    -- DECIMAL(10,2) = number with 2 decimal places e.g. 2400.00
    -- CHECK (amount > 0) = amount must be positive

    category    VARCHAR(50) NOT NULL,
    -- The category e.g. 'Salary', 'Food', 'Rent'

    date        DATE NOT NULL,
    -- Stores date as YYYY-MM-DD e.g. '2026-03-01'

    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- Automatically saves the exact time each record was created
);


-- ------------------------------------------------
-- STEP 3: INSERT DATA (Add transactions)
-- Like filling in a form and filing it
-- This matches what addTransaction() does in script.js
-- ------------------------------------------------
INSERT INTO transactions (type, description, amount, category, date)
VALUES ('income', 'SaskTel Salary', 2400.00, 'Salary', '2026-03-01');

INSERT INTO transactions (type, description, amount, category, date)
VALUES ('expense', 'Monthly Rent', 900.00, 'Rent', '2026-03-01');

INSERT INTO transactions (type, description, amount, category, date)
VALUES ('expense', 'Groceries', 120.50, 'Food', '2026-03-02');

INSERT INTO transactions (type, description, amount, category, date)
VALUES ('expense', 'University Tuition', 600.00, 'Education', '2026-03-03');

INSERT INTO transactions (type, description, amount, category, date)
VALUES ('income', 'Freelance Project', 300.00, 'Freelance', '2026-03-04');


-- ------------------------------------------------
-- STEP 4: READ DATA (View transactions)
-- Like pulling files from the cabinet
-- This matches what renderTransactions() does in script.js
-- ------------------------------------------------

-- View ALL transactions, newest first
SELECT * FROM transactions
ORDER BY date DESC;

-- View only INCOME transactions
SELECT * FROM transactions
WHERE type = 'income'
ORDER BY date DESC;

-- View only EXPENSE transactions
SELECT * FROM transactions
WHERE type = 'expense'
ORDER BY date DESC;

-- View transactions for a specific category
SELECT * FROM transactions
WHERE category = 'Food';


-- ------------------------------------------------
-- STEP 5: CALCULATE TOTALS
-- Like adding up all the numbers in a column
-- This matches what updateSummary() does in script.js
-- ------------------------------------------------

-- Total income
SELECT SUM(amount) AS total_income
FROM transactions
WHERE type = 'income';

-- Total expenses
SELECT SUM(amount) AS total_expenses
FROM transactions
WHERE type = 'expense';

-- Current balance (income minus expenses)
SELECT
  SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) -
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS balance
FROM transactions;

-- Monthly summary (spending per category)
SELECT
  category,
  SUM(amount) AS total_spent
FROM transactions
WHERE type = 'expense'
GROUP BY category
ORDER BY total_spent DESC;


-- ------------------------------------------------
-- STEP 6: DELETE DATA
-- Like removing a file from the cabinet
-- This matches what deleteTransaction() does in script.js
-- ------------------------------------------------

-- Delete one specific transaction by ID
DELETE FROM transactions WHERE id = 3;

-- Delete all transactions of a specific type
DELETE FROM transactions WHERE type = 'expense';


-- ------------------------------------------------
-- STEP 7: UPDATE DATA
-- Like correcting a filed record
-- ------------------------------------------------

-- Update the amount of a specific transaction
UPDATE transactions
SET amount = 2600.00
WHERE id = 1;

-- Change a transaction's category
UPDATE transactions
SET category = 'Utilities'
WHERE id = 2;