const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { title } = require('process');

exports.new_post = asyncHandler(async (req, res, next) => {
  res.render('new_post', { title: 'Posts List' });
});

exports.post_create = asyncHandler(async (req, res, next) => {
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('text', 'Text must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape();

  const errors = validationResult(req);
  const postUser = await User.findById(req.user._id).exec();

  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    user: postUser,
    timestamp: Date.now(),
  });
  if (!errors.isEmpty()) {
    res.render('new_post', {
      title: 'Create Post',
      post: post,
      errors: errors.array(),
    });
    return;
  } else {
    try {
      const result = await post.save();
      res.redirect('/');
    } catch (err) {
      return next(err);
    }
  }
});
