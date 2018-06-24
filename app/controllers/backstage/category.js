const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Category = mongoose.model('Category');

module.exports = (app) => {
    app.use('/backstage/categories', router);
};

router.get('/', (req, res, next) => {
    res.render('backstage/category/index', {
        pretty: true,
    });
});
router.get('/add', (req, res, next) => {
    res.render('backstage/category/add', {
        pretty: true,
    });
});
router.post('/add', (req, res, next) => {

});
router.get('/edit/:id', (req, res, next) => {

});
router.post('/edit/:id', (req, res, next) => {

});
router.get('/delete/:id', (req, res, next) => {
   
});