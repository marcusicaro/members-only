const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { title } = require('process');
const bcrypt = require('bcryptjs');
const moment = require('moment');

exports.index = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .sort({ timestamp: 1 })
    .populate('user')
    .exec();

  res.render('index', {
    title: 'Local Library Home',
    user: req.user,
    posts: allPosts,
  });
});

exports.user_page = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  res.render('user_view', { user: user });
});

exports.user_create_get = asyncHandler(async (req, res, next) => {
  res.render('sign_up', { title: 'Sign Up' });
});

exports.user_create_post = asyncHandler(async (req, res, next) => {
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('passwordConfirmation').custom((value, { req }) => {
      return value === req.body.password;
    }),
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      try {
        const user = new User({
          name: req.body.name,
          username: req.body.username,
          password: hashedPassword,
        });
        const result = await user.save();
        res.redirect('/');
      } catch (err) {
        return next(err);
      }
    });
});

exports.user_change_membership_status = asyncHandler(async (req, res, next) => {
  if (req.body.member_password === 'secret') {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).exec();
      user.member = !user.member;
      const result = await user.save();
    } catch (err) {
      return next(err);
    }
  }
  res.redirect('/member');
});

exports.user_change_admin_status = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .sort({ timestamp: 1 })
    .populate('user')
    .exec();

  if (req.body.admin_password === 'admin') {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).exec();
      user.admin = !user.admin;
      const result = await user.save();
    } catch (err) {
      return next(err);
    }
    res.redirect('/');
  } else {
    res.render('index', {
      title: 'Local Library Home',
      user: req.user,
      posts: allPosts,
      adminPasswordError: 'incorrect admin password',
    });
  }
});

exports.member_page = asyncHandler(async (req, res, next) => {
  res.render('member', { user: req.user });
});
