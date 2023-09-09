const express = require('express');
const router = express.Router();
const User = require('../models/user');

const post_controller = require('../controllers/postsController');
const user_controller = require('../controllers/userController');
require('dotenv').config();
const passport = require('passport');
router.get('/', user_controller.index);
router.get('/new-post', post_controller.new_post);
router.post('/new-post', post_controller.post_create);
router.get('/sign-up', user_controller.user_create_get);
router.post('/sign-up', user_controller.user_create_post);

router.get('/user', user_controller.user_page);
router.get('/log-out', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
router.get('/member', user_controller.member_page);
router.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-up',
  })
);

router.post('/become-member', user_controller.user_change_membership_status);

module.exports = router;
