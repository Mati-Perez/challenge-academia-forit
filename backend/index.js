const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors())

let tasks = [
  {
    id: 1,
    title: "Comprar pan",
    description: "Ir a la panadería y comprar 2 baguettes",
    completed: false,
    createdAt: new Date()
  },
  {
    id: 2,
    title: "Estudiar Express",
    description: "Revisar rutas y middlewares",
    completed: true,
    createdAt: new Date("2023-07-24")
  }
];

const generateId = () => {
  const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
  return maxId + 1;
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/tasks', (request, response) => {
  response.json(tasks);
})

app.get('/api/tasks/:id', (request, response) => {
  const id= Number(request.params.id)
  const task = tasks.find(task => task.id === id)

  if(task){
    response.json(task);
  }else{
    response.status(400).end();
  }
})



app.post('/api/tasks', (request, response) => {
  const body = request.body;

  if(!body.title){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const task = {
    id: generateId(),
    title: body.title,
    description: body.description,
    completed: Boolean(body.completed) || false,
    createdAt: new Date()
  }
  tasks = tasks.concat(task);
  response.json(task);
})

app.delete('/api/tasks/:id', (request, response) => {
  const id= Number(request.params.id);
  tasks = tasks.filter(task => task.id !=id);

  response.status(204).end();
})

app.put('/api/tasks/:id', (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;

  if (!body.title) {
    return response.status(400).json({ error: 'title missing' });
  }

  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return response.status(404).json({ error: 'task not found' });
  }

  const updatedTask = {
    ...tasks[index],
    title: body.title,
    description: body.description || tasks[index].description,
    completed: typeof body.completed === 'boolean' ? body.completed : tasks[index].completed
  };

  tasks[index] = updatedTask;

  response.json(updatedTask);
});

app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
