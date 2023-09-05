const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { title } = require('process');

exports.index = asyncHandler(async (req, res, next) => {
  const [numPosts, numCategories] = await Promise.all([
    Post.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Local Library Home',
    post_count: numPosts,
    user_count: numCategories,
  });
});

exports.posts_list = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .sort({ timestamp: 1 })
    .populate('user')
    .exec();

  res.render('posts_list', { title: 'Posts List', post_list: allPosts });
});
