const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const md5 = require('md5');
const passport = require('passport');
const User = mongoose.model('User');

module.exports = (app) => {
  app.use('/backstage/users', router);
};
module.exports.requireLogin = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('error', '只有登录用户才能访问');
    res.redirect('/backstage/users/login');
  }
};

router.get('/login', (req, res, next) => {
  res.render('backstage/user/login',{
    pretty: true,
  });
});
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/admin/users/login',
  failureFlash: '用户名或密码错误',
  }), (req, res, next) => {
    console.log('user login success: ', req.body);
    res.redirect('/backstage/posts');
});
router.get('/register', (req, res, next) => {
  res.render('backstage/user/register', {
    pretty: true,
  });
});
router.post('/register', (req, res, next) => {
  req.checkBody('email', '邮箱不能为空').notEmpty().isEmail();
  req.checkBody('password', '密码不能为空').notEmpty();
  req.checkBody('confirmPassword', '两次密码不匹配').notEmpty().equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    return res.render('backstage/user/register', req.body);
  }

  var user = new User({
    name: req.body.email.split('@').shift(),
    email: req.body.email,
    password: md5(req.body.password),
    created: new Date(),
  });

  user.save(function (err, user) {
    if (err) {
      console.log('backstage/user/register error:', err);
      req.flash('error', '用户注册失败');
      res.render('backstage/user/register');
    } else {
      req.flash('info', '用户注册成功');
      res.redirect('/backstage/users/login');
    }
  });
});
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});