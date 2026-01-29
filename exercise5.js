const express = require("express");
const app = express();

app.use(express.json());

// In-memory task storage
let todos = [];
let idCounter = 1;

/**
 * CREATE a task
 * POST /todos
 */
app.post("/todos", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const todo = {
        id: idCounter++,
        title,
        completed: false
    };

    todos.push(todo);
    res.status(201).json(todo);
});

/**
 * READ all tasks
 * GET /todos
 */
app.get("/todos", (req, res) => {
    res.json(todos);
});

/**
 * READ task by ID
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
 * UPDATE task
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
 * DELETE task
 * DELETE /todos/:id
 */
app.delete("/todos/:id", (req, res) => {
    const index = todos.findIndex(t => t.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: "Todo not found" });
    }

    const deleted = todos.splice(index, 1);
    res.json(deleted[0]);
});

// Start server
app.listen(3000, () => {
    console.log("TODO API running on http://localhost:3000");
});
