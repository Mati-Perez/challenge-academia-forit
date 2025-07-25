import { useState } from 'react'
import { 
  Routes, Route, Link, useMatch,
  Navigate
} from 'react-router-dom'
import './App.css'
import TaskItem from './pages/TaskItem'
import TaskList from './pages/TaskList'
import TaskForm from './pages/TaskForm'

const App = () => {
  

  return(
    <div>
      <div>
        <Link to="/tasks">Lista de Tareas | </Link>
        <Link to="/taskform">Crear/editar tareas</Link>
      </div>

      <Routes>
        <Route path="/tasks/:id" element={<TaskItem />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/taskform" element={<TaskForm />} />
        <Route path="/" element={<Navigate replace to="/tasks" />} />
      </Routes>

    </div>
  )
}

export default App
