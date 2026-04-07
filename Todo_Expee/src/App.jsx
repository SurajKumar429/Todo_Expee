import {useState, React} from 'react'

const App = () => {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  return (
    <div> 
      <h2>Todo_Expee App</h2>

      <input type='text' placeholder='Enter Your Task' value={task} onChange={(e) => setTask(e.target.value)}>
      </input>

       <button>Add Task</button>
    </div>
  )
}

export default App