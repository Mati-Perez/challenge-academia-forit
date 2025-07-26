import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import taskService from '../services/tasks'
import TaskItem from './TaskItem'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    taskService.getAll().then(initialTasks => setTasks(initialTasks))
  }, [])

  const toggleCompleted = async (id) => {
    const taskToUpdate = tasks.find(t => t.id === id)
    if (!taskToUpdate) return

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed }

    try {
      const returnedTask = await taskService.update(id, updatedTask)
      setTasks(tasks.map(t => t.id === id ? returnedTask : t))
    } catch (error) {
      console.error('Error actualizando la tarea:', error)
    }
  }

  const removeTask = async (id) => {
    try {
      await taskService.remove(id)
      setTasks(tasks.filter(t => t.id !== id))
      setMessage('Tarea borrada con éxito!')
      setMessageType('success')
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 3000)
    } catch (error) {
      console.error('Error eliminando la tarea:', error)
      setMessage('Error al eliminar la tarea')
      setMessageType('error')
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 3000)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter =
      filter === 'completed' ? task.completed :
      filter === 'incomplete' ? !task.completed :
      true
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-[85vh] w-[80vw] mx-auto p-4 rounded-xl bg-blue-100/40 border border-white/30 backdrop-blur-md transition-all">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Lista de tareas</h1>
      <div className="mb-4 flex gap-2 justify-center w-full">
        <button
          onClick={() => setFilter('all')}
          className="px-4 py-2 rounded-lg hover:bg-blue-300 transition"
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('completed')}
          className="px-4 py-2 rounded-lg hover:bg-green-300 transition"
        >
          Completas
        </button>
        <button
          onClick={() => setFilter('incomplete')}
          className="px-4 py-2 rounded-lg hover:bg-red-300 transition"
        >
          Incompletas
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por título..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 w-[300px] p-3 rounded-xl border border-white/30 bg-blue-100/40 backdrop-blur-md"
      />

      <ul>
        {filteredTasks.map(task =>
          <TaskItem key={task.id} task={task} onToggle={toggleCompleted} onRemove={removeTask} />
        )}
      </ul>

      <button
        className="fixed right-8 bottom-10 w-14 h-14 rounded-full bg-blue-500 text-white text-3xl border-none shadow-lg flex items-center justify-center z-50 transition hover:bg-blue-700"
        onClick={() => navigate('/taskform')}
        aria-label="Agregar tarea"
      >
        +
      </button>

      {message && (
        <div
          className={`border-2 rounded-lg p-3 mt-4 mx-auto w-[300px] text-center ${
            messageType === 'success'
              ? 'border-green-500 text-green-700 bg-green-50'
              : 'border-red-500 text-red-700 bg-red-50'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
