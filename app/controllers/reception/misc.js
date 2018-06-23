const express = require('express');
const router = express.Router();

module.exports = (app) => {
    app.use('/', router);
};

router.get('/', (req, res, next) => {
    res.redirect('/posts')
});
router.get('/about', (req, res, next) => {
    res.render('reception/index', {
        title: 'About me',
    });
});
router.get('/contact', (req, res, next) => {
    res.render('reception/index', {
        title: 'Contact me',
    });
});
