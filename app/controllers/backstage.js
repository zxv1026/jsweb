const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = (app) => {
  app.use('/backstage', router);
};

router.get('/', (req, res, next) => {
  Post.find((err, posts) => {
    if (err) return next(err);
    res.render('backstage/index', {
      title: 'blog backstage',
      posts: posts
    });
  });
});
