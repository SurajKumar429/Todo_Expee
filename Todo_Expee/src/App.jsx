import { useState, React } from "react";

const App = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Function to add a task
  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([...tasks, task]);
    setTask("");
  };

  // Fuction to delete a task
  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div>
      <h2>Todo_Expee App</h2>

      <input
        type="text"
        placeholder="Enter Your Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      ></input>

      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((t, index) => (
          <li key={index}>{t}
          <button onClick={ () => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
