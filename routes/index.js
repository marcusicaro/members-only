const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postsController');
const category_controller = require('../controllers/categoryController');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();
const MongoDBKey = process.env.MONGODB_KEY;

router.get('/', post_controller.index);
router.get('/post/create', post_controller.post_create_get);
router.post(
  '/post/create',
  upload.single('uploaded_file'),
  post_controller.post_create_post
);
