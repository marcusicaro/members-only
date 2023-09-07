const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { title } = require('process');
const bcrypt = require('bcryptjs');

exports.user_page = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  res.render('user_view', { user: user });
});

exports.user_create = asyncHandler(async (req, res, next) => {
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