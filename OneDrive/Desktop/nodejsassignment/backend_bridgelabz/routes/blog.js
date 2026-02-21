/**
 * Exercise 6: Simple Blog
 * GET  /blog          → list all posts
 * GET  /blog/new      → form to create new post
 * POST /blog          → save new post
 * GET  /blog/:id      → view individual post
 */

const express = require('express');
const router = express.Router();

// In-memory store (no DB needed for the exercise)
let posts = [
    {
        id: 1,
        title: 'Getting Started with Node.js',
        author: 'Rahul Sharma',
        date: '2026-02-10',
        category: 'Tutorial',
        excerpt: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine. Let\'s explore the basics.',
        content: `Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to use JavaScript for server-side scripting. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications.\n\nIn this post, we'll cover the basics of setting up a Node.js project, understanding modules, and working with the file system. Node.js comes with npm (Node Package Manager) which gives you access to thousands of reusable packages.\n\nTo get started, install Node.js from nodejs.org and verify with: node --version`,
    },
    {
        id: 2,
        title: 'Understanding Express.js Middleware',
        author: 'Priya Patel',
        date: '2026-02-14',
        category: 'Deep Dive',
        excerpt: 'Middleware functions are the backbone of Express.js. Learn how they work.',
        content: `Middleware in Express.js are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle.\n\nMiddleware functions can:\n- Execute any code\n- Make changes to req and res objects\n- End the request-response cycle\n- Call the next middleware\n\nYou apply middleware using app.use() for global middleware or attach it to specific routes for route-level middleware. Common examples include logging, authentication, body parsing, and error handling.`,
    },
    {
        id: 3,
        title: 'EJS Templating Engine Guide',
        author: 'Amit Singh',
        date: '2026-02-18',
        category: 'Guide',
        excerpt: 'EJS makes it easy to generate HTML with JavaScript. Here\'s everything you need to know.',
        content: `EJS (Embedded JavaScript Templates) is a simple templating language that lets you generate HTML markup with plain JavaScript. It's great for server-side rendering in Express.js apps.\n\nKey EJS tags:\n- <% %> for JavaScript logic (loops, conditionals)\n- <%= %> for outputting escaped values\n- <%- %> for unescaped HTML output\n- <%# %> for comments\n- <%- include('partial') %> to include partials\n\nEJS integrates seamlessly with Express via app.set('view engine', 'ejs').`,
    },
];

let nextId = 4;

// GET /blog — list all posts
router.get('/', (req, res) => {
    res.render('blog/index', { posts });
});

// GET /blog/new — show create form (must be before /:id)
router.get('/new', (req, res) => {
    res.render('blog/new', { error: null, formData: {} });
});

// POST /blog — create new post
router.post('/', (req, res) => {
    const { title, author, category, excerpt, content } = req.body;

    if (!title || !content || !author) {
        return res.render('blog/new', {
            error: 'Title, Author, and Content are required.',
            formData: req.body,
        });
    }

    const post = {
        id: nextId++,
        title: title.trim(),
        author: author.trim(),
        date: new Date().toISOString().split('T')[0],
        category: (category || 'General').trim(),
        excerpt: (excerpt || content.substring(0, 120) + '...').trim(),
        content: content.trim(),
    };

    posts.unshift(post); // add to front
    res.redirect(`/blog/${post.id}`);
});

// GET /blog/:id — view single post
router.get('/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).render('404', { url: req.originalUrl });
    }
    const otherPosts = posts.filter(p => p.id !== post.id).slice(0, 3);
    res.render('blog/show', { post, otherPosts });
});

module.exports = router;
