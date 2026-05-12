import React, { useState, useEffect } from "react";
import Expense from "./Expense";
import "./App.css";

const App = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [tab, setTab] = useState("todo");
  const [task, setTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (!savedTasks) return [];

    return JSON.parse(savedTasks).map((item, index) =>
      typeof item === "string"
        ? {
            id: `task-${Date.now()}-${index}`,
            text: item,
            completed: false,
            date: today,
          }
        : {
            ...item,
            id: item.id ?? `task-${Date.now()}-${index}`,
            completed: Boolean(item.completed),
            date: item.date ?? today,
          },
    );
  });
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    if (editTaskId !== null) {
      const updated = tasks.map((item) =>
        item.id === editTaskId
          ? {
              ...item,
              text: task,
            }
          : item,
      );
      setTasks(updated);
      setEditTaskId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: `task-${Date.now()}`,
          text: task,
          completed: false,
          date: selectedDate,
        },
      ]);
    }
    setTask("");
  };

  const deleteTask = (taskId) => {
    const updated = tasks.filter((item) => item.id !== taskId);
    setTasks(updated);
  };

  const editTask = (taskId) => {
    const currentTask = tasks.find((item) => item.id === taskId);
    if (!currentTask) return;

    setTask(currentTask.text);
    setSelectedDate(currentTask.date);
    setEditTaskId(taskId);
  };

  const toggleTask = (taskId) => {
    const updated = tasks.map((item) =>
      item.id === taskId
        ? {
            ...item,
            completed: !item.completed,
          }
        : item,
    );
    setTasks(updated);
  };

  const filteredTasks = tasks.filter((item) => item.date === selectedDate);
  const completedTasks = filteredTasks.filter((item) => item.completed).length;

  return (
    <div className="app-wrapper">
      <div className={tab === "expense" ? "app-card expense-full-width" : "app-card"}>
        <h2 className="app-title">Todo_Expee App</h2>

        <div className="tab-buttons">
          <button
            className={tab === "todo" ? "tab-btn active-tab" : "tab-btn"}
            onClick={() => setTab("todo")}
          >
            Todo
          </button>
          <button
            className={tab === "expense" ? "tab-btn active-tab" : "tab-btn"}
            onClick={() => setTab("expense")}
          >
            Expense
          </button>
        </div>

        {tab === "todo" && (
          <div className="section-card">
            <h3 className="section-title">My Tasks</h3>

            <div className="date-filter-row">
              <label className="date-label" htmlFor="task-date">
                Select Date
              </label>
              <input
                id="task-date"
                className="date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="input-row">
              <input
                type="text"
                placeholder="Enter Your Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              <button className="primary-btn" onClick={addTask}>
                {editTaskId !== null ? "Update Task" : "Add Task"}
              </button>
            </div>

            <div className="summary-box">
              <p>
                Tasks on {selectedDate}: {filteredTasks.length} | Completed: {completedTasks}
              </p>
            </div>

            <ul className="task-list">
              {filteredTasks.map((t) => (
                <li key={t.id} className="task-item">
                  <div className="task-content">
                    <input
                      className="task-checkbox"
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                    />
                    <span className={t.completed ? "task-text completed-task" : "task-text"}>
                      {t.text}
                    </span>
                  </div>
                  <span className={t.completed ? "status-badge done-status" : "status-badge pending-status"}>
                    {t.completed ? "Completed" : "Pending"}
                  </span>
                  <div className="task-actions">
                    <button className="edit-btn" onClick={() => editTask(t.id)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteTask(t.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {filteredTasks.length === 0 && (
              <p className="empty-text">No tasks for {selectedDate}.</p>
            )}
          </div>
        )}

        {tab === "expense" && <Expense />}
      </div>
    </div>
  );
};

export default App;
