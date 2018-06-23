const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = (app) => {
    app.use('/posts', router);
};

router.get('/', (req, res, next) => {
    Post.find().populate('author').populate('category').exec((err, posts) => {
        if (err) return next(err);
        res.render('reception/index', {
            posts: posts,
            pretty: true,
        });
    });
});
router.get('/view', (req, res, next) => {
});
router.get('/comment', (req, res, next) => {
});
router.get('/favourite', (req, res, next) => {
});