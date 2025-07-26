import React, { useEffect, useState } from 'react'
import taskService from '../services/tasks'
import { useNavigate, useParams } from 'react-router-dom'

export default function TaskForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      taskService.getAll().then(tasks => {
        const task = tasks.find(t => t.id === Number(id))
        if (task) {
          setTitle(task.title)
          setDescription(task.description)
        }
      })
    }
  }, [id])

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleDescriptionChange = (event) => setDescription(event.target.value)

  const addTask = async (event) => {
    event.preventDefault()
    const taskObject = {
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString()
    }
    try {
      if (id) {
        await taskService.update(id, taskObject)
        setMessage('Tarea actualizada!')
        setMessageType('success')
      } else {
        await taskService.create(taskObject)
        setTitle('')
        setDescription('')
        setMessage('Nueva tarea agregada!')
        setMessageType('success')
      }
      setTimeout(() => {
        setMessage('')
        setMessageType('')
        navigate('/tasks')
      }, 3000)
    } catch (error) {
      setMessage('Error: No se pudo crear la tarea.')
      setMessageType('error')
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 3000)
      console.error('Error creando la tarea: ', error)
    }
  }

  return (
    <div className="min-h-[85vh] w-[80vw] mx-auto p-4 rounded-xl bg-blue-100/40 border border-white/30 backdrop-blur-md transition-all">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">{id ? 'Editar Tarea' : 'Nueva Tarea'}</h1>
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
      <form onSubmit={addTask} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Titulo"
          value={title}
          onChange={handleTitleChange}
          required
          className="mb-4 w-[300px] p-3 rounded-xl border border-white/30 bg-blue-100/40 backdrop-blur-md"
        />
        <textarea
          value={description}
          placeholder="Descripcion"
          onChange={handleDescriptionChange}
          className="mb-4 w-[300px] h-[100px] p-3 rounded-xl border border-white/30 bg-blue-100/40 backdrop-blur-md"
        />
        <div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white mr-2 hover:bg-blue-700 transition"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
