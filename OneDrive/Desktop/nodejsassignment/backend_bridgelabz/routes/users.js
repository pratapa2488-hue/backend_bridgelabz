/**
 * Exercise 1: Route with query parameters — filter users by name
 * GET /users          → list all users
 * GET /users?name=ra  → filter users whose name contains "ra" (case-insensitive)
 */

const express = require('express');
const router = express.Router();

const users = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Admin' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'Developer' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', role: 'Designer' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', role: 'Developer' },
    { id: 5, name: 'Ravi Kumar', email: 'ravi@example.com', role: 'Manager' },
    { id: 6, name: 'Ananya Verma', email: 'ananya@example.com', role: 'QA' },
    { id: 7, name: 'Deepak Nair', email: 'deepak@example.com', role: 'Developer' },
    { id: 8, name: 'Kavya Menon', email: 'kavya@example.com', role: 'Admin' },
];

// GET /users?name=<query>
router.get('/', (req, res) => {
    const { name } = req.query;
    let filtered = users;

    if (name && name.trim()) {
        const search = name.trim().toLowerCase();
        filtered = users.filter(u => u.name.toLowerCase().includes(search));
    }

    res.render('users', {
        users: filtered,
        query: name || '',
        total: users.length,
    });
});

module.exports = router;
