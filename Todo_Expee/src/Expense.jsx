import { useState, useEffect } from "react";

function Expense() {
  const [selectedDate, setSelectedDate] = useState("");
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Transaction Function
  const addTransaction = () => {
    if (!text || !amount) return;

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      text,
      amount: Number(amount),
      type,
      date: new Date(selectedDate).toISOString(),
    };

    setTransactions([...transactions, newTransaction]);

    setText("");
    setAmount("");
    setType("expense");
  };

  //Total Income
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  //Total Expenses
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  //Savings
  const savings = income - expense;

  // Monthly Breakdown
  const selected = selectedDate ? new Date(selectedDate) : new Date();

  const selectedMonth = selected.getMonth();
  const selectedYear = selected.getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlySavings = monthlyIncome - monthlyExpense;

  // Yearly Breakdown
  const yearlyTransactions = transactions.filter((t) => {
    return new Date(t.date).getFullYear() === selectedYear;
  });

  const yearlyIncome = yearlyTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const yearlyExpense = yearlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const yearlySavings = yearlyIncome - yearlyExpense;

  // Daily Breakdown
  const dailyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.toISOString().slice(0, 10) === selectedDate;
  });

  const dailyIncome = dailyTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const dailyExpense = dailyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const dailySavings = dailyIncome - dailyExpense;

  // Delete Transaction
  const deleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
  };

  // SOrting Transactions by Date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <h2>Expense Tracker</h2>

      <input
        placeholder="Enter description"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <p>Selected Date: {selectedDate || "None"}</p>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button onClick={addTransaction}>Add</button>
      <ul>
        {sortedTransactions.map((t) => (
          <li key={t.id}>
            {t.text} - {t.amount} ({t.type})
            <button onClick={() => deleteTransaction(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Income: {income}</h3>
      <h3>Expense: {expense}</h3>
      <h3>Savings: {savings}</h3>

      {selectedDate && (
        <>
          <h3>Daily Summary</h3>
          <p>Income: {dailyIncome}</p>
          <p>Expense: {dailyExpense}</p>
          <p>Savings: {dailySavings}</p>

          <h3>Monthly Summary</h3>
          <p>Income: {monthlyIncome}</p>
          <p>Expense: {monthlyExpense}</p>
          <p>Savings: {monthlySavings}</p>

          <h3>Yearly Summary</h3>
          <p>Income: {yearlyIncome}</p>
          <p>Expense: {yearlyExpense}</p>
          <p>Savings: {yearlySavings}</p>
        </>
      )}

      {selectedDate && (
        <>
          <h4>Transactions on Selected Date</h4>
          <ul>
            {dailyTransactions.map((t) => (
              <li key={t.id}>
                {t.text} - {t.amount} ({t.type})
              </li>
            ))}
          </ul>
        </>
      )}

      <h4>Monthly Transactions: {monthlyTransactions.length}</h4>
      <h4>Yearly Transactions: {yearlyTransactions.length}</h4>
    </div>
  );
}

export default Expense;
