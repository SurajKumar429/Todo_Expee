import { useState, useEffect } from "react";

function Expense() {
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

    const newTransaction = {
      text,
      amount: Number(amount),
      type,
      date: new Date().toISOString(),
    };

    setTransactions([...transactions, newTransaction]);

    setText("");
    setAmount("");
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
  const currentMonth = new Date().getMonth();

  const monthlyTransactions = transactions.filter((t) => {
    return new Date(t.date).getMonth() === currentMonth;
  });

  // Yearly Breakdown
  const currentYear = new Date().getFullYear();

  const yearlyTransactions = transactions.filter((t) => {
    return new Date(t.date).getFullYear() === currentYear;
  });

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

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button onClick={addTransaction}>Add</button>
      <ul>
        {transactions.map((t, index) => (
          <li key={index}>
            {t.text} - {t.amount} ({t.type})
          </li>
        ))}
      </ul>
      <h3>Income: {income}</h3>
      <h3>Expense: {expense}</h3>
      <h3>Savings: {savings}</h3>

      <h4>Monthly Transactions: {monthlyTransactions.length}</h4>
      <h4>Yearly Transactions: {yearlyTransactions.length}</h4>
    </div>
  );
}

export default Expense;
