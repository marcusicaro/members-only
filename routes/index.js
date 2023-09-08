const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postsController');
const user_controller = require('../controllers/userController');
require('dotenv').config();
const passport = require('passport');
router.get('/', user_controller.index);
router.get('/posts', post_controller.posts_list);
router.post('/posts', post_controller.post_create);
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
router.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-up',
  })
);

module.exports = router;
