import React, { useState } from 'react'
import taskService from '../services/tasks'

export default function TaskForm() {
  const [newTask, setNewTask] = useState('a new task...');
  
  
  const handleTaskChange = (event) => {
    setNewTask(event.target.value)
  }

  const addTask = (event) => {
    event.preventDefault();
    const taskObject = {
      title: newTask,
      description:'',
      completed:'',
      createdAt: ''
    }
    taskService
      .create(taskObject)
      .then(returnedTask => {
        setTasks(tasks.concat(returnedTask))
        setNewTask('')
      })

  }

  return (
    <div>
      <h1>Nueva Tarea</h1>
      <form onSubmit = {addTask}>
        <input value={newTask} onChange={handleTaskChange} />
        <button type="submit">guardar</button>
      </form>
      
    </div>
  )
}

  /*const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

 noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      }).catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
} */

