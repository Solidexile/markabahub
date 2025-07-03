const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Create a post
router.post('/', protect, postController.createPost);
// Get all posts
router.get('/', protect, postController.getPosts);
// Get posts by user
router.get('/user/:userId', protect, postController.getPostsByUser);
// Like/unlike a post
router.put('/like/:postId', protect, postController.likePost);
// Comment on a post
router.post('/comment/:postId', protect, postController.addComment);
// Delete a post
router.delete('/:postId', protect, postController.deletePost);

module.exports = router;
