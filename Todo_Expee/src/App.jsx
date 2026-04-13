import { useState, React } from "react";

const App = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Function to add a task
  const addTask = () => {
    if (task.trim() === "") return;

    if(editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex] = task;
      setTasks(updated);
      setEditIndex(null);
    } else {

    setTasks([...tasks, task]);
    }
    setTask("");
  };

  // Fuction to delete a task
  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  // Function to edit a task
  const editTask = (index) => {
    setTask(tasks[index]);
    setEditIndex(index);
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

      <button onClick={addTask}>
        {editIndex !== null ? "Update Task" : "Add Task"}
      </button>

      <ul>
        {tasks.map((t, index) => (
          <li key={index}>{t}
          <button onClick={ () => deleteTask(index)}>Delete</button>
          <button onClick={ () => editTask(index)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
