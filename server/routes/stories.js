const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createStory,
  getStories,
  viewStory,
  deleteStory
} = require('../controllers/storyController');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getStories)
  .post(protect, upload.single('media'), createStory);

router.route('/:id/view')
  .put(protect, viewStory);

router.route('/:id')
  .delete(protect, deleteStory);

module.exports = router;