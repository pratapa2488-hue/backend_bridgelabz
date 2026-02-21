/**
 * Exercise 3: Contact form using EJS — GET renders form, POST handles submission
 * GET  /contact  → show contact form
 * POST /contact  → handle form data
 */

const express = require('express');
const router = express.Router();

// GET — render contact form
router.get('/', (req, res) => {
    res.render('contact', { success: false, error: null, formData: {} });
});

// POST — process form submission
router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.render('contact', {
            success: false,
            error: 'Name, Email, and Message are required fields.',
            formData: req.body,
        });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('contact', {
            success: false,
            error: 'Please enter a valid email address.',
            formData: req.body,
        });
    }

    // In real app you'd send an email or save to DB here
    console.log(`📧  Contact form submission:`);
    console.log(`    Name   : ${name}`);
    console.log(`    Email  : ${email}`);
    console.log(`    Subject: ${subject || '(none)'}`);
    console.log(`    Message: ${message}`);

    res.render('contact', { success: true, error: null, formData: {} });
});

module.exports = router;
