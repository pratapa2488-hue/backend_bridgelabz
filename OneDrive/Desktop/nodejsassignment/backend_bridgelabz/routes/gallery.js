/**
 * Exercise 5: Photo Gallery — static files + EJS
 * GET /gallery → display all images from public/images dynamically
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    let photos = [];

    try {
        const files = fs.readdirSync(imagesDir);
        photos = files
            .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
            .map((file, index) => ({
                filename: file,
                url: `/images/${file}`,
                title: file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
                id: index + 1,
            }));
    } catch (err) {
        console.error('Gallery read error:', err.message);
    }

    res.render('gallery', { photos });
});

module.exports = router;
