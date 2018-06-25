const express = require('express');
const router = express.Router();
const slug = require('slug');
const pinyin = require('pinyin');
const mongoose = require('mongoose');
const auth = require('./user');
const Post = mongoose.model('Post');
const Category = mongoose.model('Category');

module.exports = (app) => {
    app.use('/backstage/categories', router);
};

router.get('/', auth.requireLogin,(req, res, next) => {
    res.render('backstage/category/index', {
        pretty: true,
    });
});
router.get('/add', auth.requireLogin,(req, res, next) => {
    res.render('backstage/category/add', {
        action: "/backstage/categories/add",
        pretty: true,
        category: { _id: '' },
    });
});
router.post('/add', auth.requireLogin,(req, res, next) => {
    req.checkBody('name', '分类标题不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.render('backstage/category/add', {
            errors: errors,
            name: req.body.name,
        });
    }

    var name = req.body.name.trim();
    var py = pinyin(name, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function (item) {
        return item[0];
    }).join(' ');

    var category = new Category({
        name: name,
        slug: slug(py),
        created: new Date(),
    });

    category.save(function (err, category) {
        if (err) {
            console.log('category/add error:', err);
            req.flash('error', '分类保存失败');
            res.redirect('/backstage/categories/add');
        } else {
            req.flash('info', '分类保存成功');
            res.redirect('/backstage/categories');
        }
    });
});
router.get('/edit/:id', auth.requireLogin,getCategoryById,(req, res, next) => {
    res.render('backstage/category/add', {
        action: "/backstage/categories/edit/" + req.category._id,
        category: req.category,
    });
});
router.post('/edit/:id', auth.requireLogin,getCategoryById,(req, res, next) => {
    var category = req.category;

    var name = req.body.name.trim();
    var py = pinyin(name, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function (item) {
        return item[0];
    }).join(' ');

    category.name = name;
    category.slug = slug(py);

    category.save(function (err, category) {
        if (err) {
            console.log('category/edit error:', err);
            req.flash('error', '分类编辑失败');
            res.redirect('/backstage/categories/edit/' + post._id);
        } else {
            req.flash('info', '分类编辑成功');
            res.redirect('/backstage/categories');
        }
    });

});
router.get('/delete/:id', auth.requireLogin,getCategoryById,(req, res, next) => {
    req.category.remove(function (err, rowsRemoved) {
        if (err) {
            return next(err);
        }

        if (rowsRemoved) {
            req.flash('success', '分类删除成功');
        } else {
            req.flash('success', '分类删除失败');
        }

        res.redirect('/backstage/categories');
    });
});
function getCategoryById(req, res, next) {
    if (!req.params.id) {
        return next(new Error('no category id provided'));
    }

    Category.findOne({ _id: req.params.id })
        .exec(function (err, category) {
            if (err) {
                return next(err);
            }
            if (!category) {
                return next(new Error('category not found: ', req.params.id));
            }

            req.category = category;
            next();
        });

}