const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db'); 

app.use(express.json());
app.use(cors());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const tasks = rows.map(t => ({
      ...t,
      completed: Boolean(t.completed)
    }));
    res.json(tasks);
  });
});

app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ error: 'task not found' });
    task.completed = Boolean(task.completed);
    res.json(task);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, completed, createdAt } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title missing' });
  }
  db.run(
    'INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, ?, ?)',
    [title, description || '', completed ? 1 : 0, createdAt || new Date().toISOString()],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        title,
        description: description || '',
        completed: !!completed,
        createdAt: createdAt || new Date().toISOString()
      });
    }
  );
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description, completed } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title missing' });
  }
  db.run(
    'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
    [title, description || '', completed ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!task) return res.status(404).json({ error: 'task not found' });
        task.completed = Boolean(task.completed);
        res.json(task);
      });
    }
  );
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
