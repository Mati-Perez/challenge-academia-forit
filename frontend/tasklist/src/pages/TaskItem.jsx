import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function TaskItem({ task, onToggle, onRemove }) {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleRemove = async () => {
    await onRemove(task.id)
    setShowModal(false)
  }

  return (
    <li className="flex items-center gap-3 my-2 mx-[250px]">
      <div
        className="p-3 rounded-xl backdrop-blur-sm bg-blue-200/40 border border-white/30 cursor-pointer transition"
        onClick={() => onToggle(task.id)}
        title={task.completed ? "Marcar como incompleta" : "Marcar como completa"}
      >
        {task.completed ? '✅' : '⬜'}
      </div>

      <div
        className={`flex-1 font-bold p-3 rounded-xl backdrop-blur-sm bg-blue-200/40 border border-white/30 cursor-pointer transition ${
          task.completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
        onClick={() => navigate(`/taskform/${task.id}`)}
        title="Editar tarea"
      >
        {task.title}
      </div>

      <div
        className="p-3 rounded-xl backdrop-blur-sm bg-blue-200/40 border border-white/30 cursor-pointer transition ml-2 text-red-600 font-bold"
        onClick={() => setShowModal(true)}
        title="Borrar tarea"
      >
        X
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="mb-4 text-lg">¿Seguro que desea borrar esta tarea?</p>
            <button
              onClick={handleRemove}
              className="px-4 py-2 rounded-lg bg-red-600 text-white mr-2 hover:bg-red-700 transition"
            >
              Borrar
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
