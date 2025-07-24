import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Task from './components/Task'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showAll, setShowAll] = useState(true);
  
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/tasks')
      .then(response => {
        setTasks(response.data)
      })
  }, [])
  

  return (
    <>
      <h1>Lista de tareas :)</h1>
      <ul>
        {tasks.map(task => 
          <Task key={task.id} task={task} />
        )}
      </ul>
    </>
  )
}



export default App
