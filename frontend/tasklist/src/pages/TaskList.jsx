import React, { useEffect, useState } from 'react'
import { 
  Routes, Route, Link, useMatch,
  Navigate
} from 'react-router-dom'
import taskService from '../services/tasks'
import TaskItem from './TaskItem';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const match = useMatch('/tasks/:id');
  const task = match ? tasks.find(task.id === Number(match.params.id)) : null;

  useEffect(() => {
      taskService
        .getAll()
        .then(initialTasks => {
          setTasks(initialTasks)
        })
    }, [])

  return (
    <div>
      <h1>Lista de tareas</h1>
      <ul>
        {tasks.map(task => 
          <TaskItem key={task.id} task={task} />
        )}
      </ul>
      
    </div>
  )
}

