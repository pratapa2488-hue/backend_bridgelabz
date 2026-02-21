/**
 * Express Framework Exercises — Main App
 * Covers: query params, response-time middleware, EJS forms,
 *         404 page, photo gallery, and a simple blog.
 *
 * Run:  node app.js
 * Open: http://localhost:3000
 */

const express = require('express');
const path = require('path');

const app = express();

// ─── View Engine ──────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Exercise 2: Response-Time Logger Middleware ───────────────────────────────
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} → ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Home — index page with links to all exercises
app.get('/', (req, res) => {
    res.render('index');
});

// Exercise routes
app.use('/users', require('./routes/users'));
app.use('/contact', require('./routes/contact'));
app.use('/gallery', require('./routes/gallery'));
app.use('/blog', require('./routes/blog'));

// ─── Exercise 4: Custom 404 Page ──────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀  Server running at http://localhost:${PORT}`);
    console.log('   Press Ctrl+C to stop\n');
});
