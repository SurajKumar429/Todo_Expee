import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

import { Pie } from "react-chartjs-2";
import { ArcElement } from "chart.js";

ChartJS.register(ArcElement);

function Expense() {
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editId, setEditId] = useState(null);
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

    if (editId !== null) {
      // UPDATE MODE
      const updated = transactions.map((t) =>
        t.id === editId
          ? {
              ...t,
              text,
              amount: Number(amount),
              type,
              date: new Date(selectedDate).toISOString(),
              category: category === "Others" ? customCategory : category,
            }
          : t,
      );

      setTransactions(updated);
      setEditId(null);
    } else {
      // CREATE MODE
      const newTransaction = {
        id: Date.now(),
        text,
        amount: Number(amount),
        type,
        category: category === "Others" ? customCategory : category,
        date: new Date(selectedDate).toISOString(),
      };

      setTransactions([...transactions, newTransaction]);
    }

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

  // Sorting Transactions by Date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // Edit Transactions
  const editTransaction = (transaction) => {
    setText(transaction.text);
    setAmount(transaction.amount);
    setType(transaction.type);
    setSelectedDate(transaction.date.slice(0, 10)); // important
    setEditId(transaction.id);
  };

  // Chart Monthly
  const monthlyData = new Array(12).fill(0);
  transactions.forEach((t) => {
    const d = new Date(t.date);

    if (d.getFullYear() !== selectedYear) return;

    const month = d.getMonth();

    if (t.type === "expense") {
      monthlyData[month] += t.amount;
    }
  });

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // Income VS Expense Chart

  const incomeData = new Array(12).fill(0);
  const expenseData = new Array(12).fill(0);
  transactions.forEach((t) => {
    const d = new Date(t.date);

    if (d.getFullYear() !== selectedYear) return;

    const month = d.getMonth();

    if (t.type === "income") {
      incomeData[month] += t.amount;
    } else {
      expenseData[month] += t.amount;
    }
  });

  const comparisonData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "green",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "red",
      },
    ],
  };

  const categoryMap = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += t.amount;
    }
  });

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: ["red", "blue", "green", "orange", "purple"],
      },
    ],
  };

  return (
    <div>
      <h2>Expense Tracker</h2>

      <input
        placeholder="Enter description"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {category === "Others" && (
        <input
          placeholder="Enter custom category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
        />
      )}

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Bills">Bills</option>
        <option value="Shopping">Shopping</option>
        <option value="Others">Others</option>
      </select>

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

      <button onClick={addTransaction}>
        {editId !== null ? "Update" : "Add"}
      </button>
      <ul>
        {sortedTransactions.map((t) => (
          <li key={t.id}>
            {t.text} - {t.amount} ({t.type})
            <button onClick={() => editTransaction(t)}>Edit</button>
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
                {t.text} - {t.amount} ({t.type}) [{t.category}]
              </li>
            ))}
          </ul>
        </>
      )}

      <h4>Monthly Transactions: {monthlyTransactions.length}</h4>
      <h4>Yearly Transactions: {yearlyTransactions.length}</h4>
      {transactions.length === 0 && (
        <p style={{ color: "gray" }}>
          No transactions yet. Add some data to see charts 📊
        </p>
      )}
      <h3>Monthly Expense Chart</h3>
      <Bar data={data} />
      <h3>Income vs Expense</h3>
      <Bar data={comparisonData} />
      <h3>Category-wise Expenses</h3>
      <Pie data={pieData} />
    </div>
  );
}

export default Expense;
