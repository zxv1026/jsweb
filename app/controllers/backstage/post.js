const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Category = mongoose.model('Category');

module.exports = (app) => {
    app.use('/backstage/posts', router);
};

router.get('/', (req, res, next) => {
    //sort
    var sortby = req.query.sortby ? req.query.sortby : 'created';
    var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';
    if (['title', 'category', 'author', 'created', 'published', 'comment.length','meta.favorite'].indexOf(sortby) === -1) {
        sortby = 'created';
    }
    if (['desc', 'asc'].indexOf(sortdir) === -1) {
        sortdir = 'desc';
    }
    var sortObj = {};
    sortObj[sortby] = sortdir;

    // condition
    var conditions = {};
    if (req.query.category) {
        conditions.category = req.query.category.trim();
    }
    if (req.query.author) {
        conditions.author = req.query.author.trim();
    }
    if (req.query.keyword) {
        conditions.title = new RegExp(req.query.keyword.trim(), 'v');
        conditions.content = new RegExp(req.query.keyword.trim(), 'v');
    }
    User.find({}, function name(err, authors) {
        if (err) return next(err);
        Post.find(conditions)
            .sort(sortObj)
            .populate('author')
            .populate('category')
            .exec((err, posts) => {
                if (err) return next(err);
                var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
                var pageSize = 10;
                var totalCount = posts.length;
                var pageCount = Math.ceil(totalCount / pageSize);
                if (pageNum > pageCount) {
                    pageNum = pageCount;
                }
                res.render('backstage/post/index', {
                    posts: posts.slice((pageNum - 1) * pageSize, pageNum * pageSize),
                    pageNum: pageNum,
                    pageCount: pageCount,
                    authors: authors,
                    sortdir: sortdir,
                    sortby: sortby,
                    pretty: true,
                    filter: {
                        category: req.query.category || "",
                        author: req.query.author || "",
                        keyword: req.query.keyword || "",
                    }
                });
            });
    });
    
});
router.get('/add', (req, res, next) => {
    res.render('backstage/post/add', {
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
   if(!req.params.id){
       return next(new Error('no poat id provided'));
   }
   Post.remove({ _id: req.params.id}).exec(function (err, rowsRemoved) {
       if(err){
           return next(err);
       }
       if(rowsRemoved){
           req.flash('success','文章删除成功');
       }else{
           req.flash('success', '文章删除失败');
       }
       res.redirect('/backstage/posts');
   })
});