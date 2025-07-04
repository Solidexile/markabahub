const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const { content, privacy, tags, location, businessId } = req.body;
  const images = req.files?.map(file => file.path) || [];

  // Ensure user is logged in
  if (!req.user || !req.user.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  const post = await Post.create({
    userId: req.user.id,
    businessId: businessId || null,
    content,
    images,
    privacy,
    tags,
    location
  });

  res.status(201).json(post);
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = asyncHandler(async (req, res, next) => {
  // Only show public posts and the user's own posts
  const posts = await Post.findAll({
    where: {
      [Op.or]: [
        { privacy: 'public' },
        { userId: req.user.id }
      ]
    },
    order: [['createdAt', 'DESC']]
  });
  res.json(posts);
});

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Private
exports.getPostsByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  // Only show public posts or posts if the requesting user is the same as the userId
  const where = { userId };
  if (req.user.id !== userId) {
    where.privacy = 'public';
  }
  const posts = await Post.findAll({
    where,
    order: [['createdAt', 'DESC']]
  });
  res.json(posts);
});

// @desc    Like/unlike a post
// @route   PUT /api/posts/like/:postId
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Check if already liked
  const likeIndex = post.likes.findIndex(
    like => like.user.toString() === userId
  );

  if (likeIndex >= 0) {
    // Unlike the post
    post.likes.splice(likeIndex, 1);
  } else {
    // Like the post
    post.likes.push({ user: userId });
  }

  await post.save();

  res.json(post);
});

// @desc    Comment on a post
// @route   POST /api/posts/comment/:postId
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Add comment
  post.comments.push({
    user: req.user.id,
    content
  });

  await post.save();

  // Populate the new comment's user data
  await post.populate({
    path: 'comments.user',
    select: 'name avatar username'
  });

  // Get the newly added comment (last in array)
  const newComment = post.comments[post.comments.length - 1];

  res.status(201).json(newComment);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:postId
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Check if user owns the post
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this post', 401));
  }

  await post.remove();

  res.json({ success: true });
});