const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { title } = require('process');

exports.posts_list = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .sort({ timestamp: 1 })
    .populate('user')
    .exec();

  res.render('posts_list', { title: 'Posts List', post_list: allPosts });
});

exports.post_create = asyncHandler(async (req, res, next) => {
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('content', 'Content must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),
    async (req, res, next) => {
      const errors = validationResult(req);
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.body.user,
        timestamp: Date.now(),
      });
      if (!errors.isEmpty()) {
        res.render('posts_list', {
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
    };
});
