const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { title } = require('process');

exports.index = asyncHandler(async (req, res, next) => {
  const [numPosts, numUsers] = await Promise.all([
    Post.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Posts home',
    post_count: numPosts,
    user_count: numUsers,
  });
});

exports.posts_list = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .sort({ name: 1 })
    .populate('user')
    .exec();

  res.render('post_list', { title: 'Posts List', post_list: allPosts });
});
