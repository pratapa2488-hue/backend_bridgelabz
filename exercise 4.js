import express from 'express';

const app = express();
const PORT = 3000;


app.use(express.json());


let todos = [];
let idCounter = 1;


app.post('/todos', (req, res) => {
    const { title, completed = false } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = {
        id: idCounter++,
        title,
        completed
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});


app.get('/todos', (req, res) => {
    res.json(todos);
});

/**
 * READ single TODO
 * GET /todos/:id
 */
app.get('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === Number(req.params.id));

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
});


app.put('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === Number(req.params.id));

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const { title, completed } = req.body;

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
});


app.delete('/todos/:id', (req, res) => {
    const index = todos.findIndex(t => t.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const deletedTodo = todos.splice(index, 1);
    res.json(deletedTodo[0]);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TODO API running on http://localhost:${PORT}`);
});
