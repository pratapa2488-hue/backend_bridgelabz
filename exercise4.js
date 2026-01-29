const express = require("express");
const app = express();

app.use(express.json()); // to read JSON body

// In-memory storage
let todos = [];
let nextId = 1;

/**
 * CREATE a new todo
 * POST /todos
 */
app.post("/todos", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const todo = {
        id: nextId++,
        title,
        completed: false
    };

    todos.push(todo);
    res.status(201).json(todo);
});

/**
 * READ all todos
 * GET /todos
 */
app.get("/todos", (req, res) => {
    res.json(todos);
});

/**
 * READ single todo by id
 * GET /todos/:id
 */
app.get("/todos/:id", (req, res) => {
    const todo = todos.find(t => t.id === Number(req.params.id));

    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
});

/**
 * UPDATE a todo
 * PUT /todos/:id
 */
app.put("/todos/:id", (req, res) => {
    const todo = todos.find(t => t.id === Number(req.params.id));

    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }

    const { title, completed } = req.body;

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
});

/**
 * DELETE a todo
 * DELETE /todos/:id
 */
app.delete("/todos/:id", (req, res) => {
    const index = todos.findIndex(t => t.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: "Todo not found" });
    }

    const deletedTodo = todos.splice(index, 1);
    res.json(deletedTodo[0]);
});

// Start server
app.listen(3000, () => {
    console.log("TODO API running on http://localhost:3000");
});
