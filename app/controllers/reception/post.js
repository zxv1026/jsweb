const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Category = mongoose.model('Category');

module.exports = (app) => {
    app.use('/posts', router);
};

router.get('/', (req, res, next) => {
    Post.find({ published: true})
    .sort('created')
    .populate('author')
    .populate('category')
    .exec((err, posts) => {
        if (err) return next(err);
        var pageNum = Math.abs(parseInt(req.query.page || 1,10));
        var pageSize = 10;
        var totalCount = posts.length;
        var pageCount = Math.ceil(totalCount/pageSize);
        if(pageNum > pageCount){
            pageNum = pageCount;
        }
        res.render('reception/index', {
            posts: posts.slice((pageNum - 1) * pageSize,pageNum * pageSize),
            pageNum:pageNum,
            pageCount:pageCount,
            pretty: true,
        });
    });
});
router.get('/category/:name', (req, res, next) => {
    Category.findOne({ name: req.params.name}).exec(function (err, category) {
        if(err){
            return next(err);
        }
        Post.find({ category: category,published: true })
        .sort('created')
        .populate('author')
        .populate('category')
        .exec(function (err, posts) {
            if(err){
                return next(err);
            }
            res.render('reception/category', {
                posts: posts,
                category: category,
                pretty: true,
            });
        })
    });
});
router.get('/view', (req, res, next) => {
});
router.get('/comment', (req, res, next) => {
});
router.get('/favourite', (req, res, next) => {
});