import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

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

  const addTransaction = () => {
    if (!text || !amount) return;

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (editId !== null) {
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

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const savings = income - expense;

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

  const deleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const editTransaction = (transaction) => {
    setText(transaction.text);
    setAmount(transaction.amount);
    setType(transaction.type);
    setSelectedDate(transaction.date.slice(0, 10));
    setEditId(transaction.id);
  };

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
        backgroundColor: "rgba(37, 99, 235, 0.65)",
      },
    ],
  };

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
        backgroundColor: "#16a34a",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "#ef4444",
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
        backgroundColor: ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"],
      },
    ],
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Expense Tracker</h2>

      <div className="expense-form-card">
        <div className="expense-form-grid">
          <input
            placeholder="Enter description"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Others">Others</option>
          </select>

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

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button className="primary-btn expense-add-btn" onClick={addTransaction}>
            {editId !== null ? "Update" : "Add"}
          </button>
        </div>

        {category === "Others" && (
          <div className="custom-category-row">
            <input
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        )}
      </div>

      <p className="selected-date">Selected Date: {selectedDate || "None"}</p>

      <div className="summary-row expense-top-summary">
        <div className="mini-card expense-summary-card">
          <h3>Income: {income}</h3>
        </div>
        <div className="mini-card expense-summary-card">
          <h3>Expense: {expense}</h3>
        </div>
        <div className="mini-card expense-summary-card">
          <h3>Savings: {savings}</h3>
        </div>
      </div>

      {selectedDate && (
        <div className="summary-details expense-summary-details">
          <div className="mini-card summary-detail-card">
            <h3>Daily Summary</h3>
            <p>Income: {dailyIncome}</p>
            <p>Expense: {dailyExpense}</p>
            <p>Savings: {dailySavings}</p>
          </div>

          <div className="mini-card summary-detail-card">
            <h3>Monthly Summary</h3>
            <p>Income: {monthlyIncome}</p>
            <p>Expense: {monthlyExpense}</p>
            <p>Savings: {monthlySavings}</p>
          </div>

          <div className="mini-card summary-detail-card">
            <h3>Yearly Summary</h3>
            <p>Income: {yearlyIncome}</p>
            <p>Expense: {yearlyExpense}</p>
            <p>Savings: {yearlySavings}</p>
          </div>
        </div>
      )}

      <div className="expense-bottom-layout">
        <div className="expense-transactions-panel">
          <div className="mini-card details-card transaction-section-card">
            <h4>Transactions on Selected Date</h4>

            <div className="transaction-count-row">
              <div className="mini-card count-card">
                <h4>Monthly Transactions: {monthlyTransactions.length}</h4>
              </div>
              <div className="mini-card count-card">
                <h4>Yearly Transactions: {yearlyTransactions.length}</h4>
              </div>
            </div>

            {selectedDate && dailyTransactions.length > 0 ? (
              <ul className="task-list">
                {dailyTransactions.map((t) => (
                  <li key={t.id} className="task-item">
                    <span>
                      {t.text} - {t.amount} ({t.type}) [{t.category}]
                    </span>
                    <div className="task-actions">
                      <button className="edit-btn" onClick={() => editTransaction(t)}>
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteTransaction(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-text">
                {selectedDate
                  ? "No transactions on selected date."
                  : "Select a date to view transactions."}
              </p>
            )}
          </div>
        </div>

        <div className="expense-analytics-panel">
          <div className="chart-card small-chart-card">
            <h3>Category-wise Expenses</h3>
            {Object.keys(categoryMap).length > 0 ? (
              <Pie data={pieData} />
            ) : (
              <p className="empty-text">No category data yet.</p>
            )}
          </div>

          <div className="chart-card small-chart-card">
            <h3>Monthly Expense Chart</h3>
            <Bar data={data} />
          </div>

          <div className="chart-card small-chart-card">
            <h3>Income vs Expense</h3>
            <Bar data={comparisonData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expense;
