const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = (app) => {
  app.use('/backstage', router);
};

router.get('/', (req, res, next) => {
  res.redirect('/backstage/posts')
});
