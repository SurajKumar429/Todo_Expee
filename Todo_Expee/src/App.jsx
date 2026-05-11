import React, { useState, useEffect } from "react";
import Expense from "./Expense";
import "./App.css";

const App = () => {
  const [tab, setTab] = useState("todo");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex] = task;
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([...tasks, task]);
    }
    setTask("");
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const editTask = (index) => {
    setTask(tasks[index]);
    setEditIndex(index);
  };

  return (
    <div className="app-wrapper">
      <div className="app-card">
        <h2 className="app-title">Todo_Expee</h2>

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

            <div className="input-row">
              <input
                type="text"
                placeholder="Enter Your Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              <button className="primary-btn" onClick={addTask}>
                {editIndex !== null ? "Update Task" : "Add Task"}
              </button>
            </div>

            <div className="summary-box">
              <p>Total Tasks: {tasks.length}</p>
            </div>

            <ul className="task-list">
              {tasks.map((t, index) => (
                <li key={index} className="task-item">
                  <span>{t}</span>
                  <div className="task-actions">
                    <button className="edit-btn" onClick={() => editTask(index)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteTask(index)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "expense" && <Expense />}
      </div>
    </div>
  );
};

export default App;
