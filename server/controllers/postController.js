const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const { content, privacy, tags, location } = req.body;
  const images = req.files?.map(file => file.path) || [];

  // Create post
  const post = await Post.create({
    user: req.user.id,
    content,
    images,
    privacy,
    tags,
    location
  });

  // Populate user data
  await post.populate('user', 'name avatar username');

  res.status(201).json(post);
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = asyncHandler(async (req, res, next) => {
  // Get posts based on privacy settings
  const posts = await Post.find({
    $or: [
      { privacy: 'public' },
      { privacy: 'friends', user: { $in: req.user.friends } },
      { user: req.user.id } // User's own posts
    ]
  })
  .sort('-createdAt')
  .populate('user', 'name avatar username')
  .populate('tags', 'name avatar username');

  res.json(posts);
});

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Private
exports.getPostsByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // Check if requesting user is friends with the target user or is the user themselves
  const isFriend = req.user.friends.includes(userId);
  const isSelf = req.user.id === userId;

  let query = { user: userId };

  if (!isSelf) {
    query.$or = [
      { privacy: 'public' },
      { privacy: 'friends', user: userId }
    ];
    
    if (!isFriend) {
      query.privacy = 'public'; // Only show public posts if not friends
    }
  }

  const posts = await Post.find(query)
    .sort('-createdAt')
    .populate('user', 'name avatar username')
    .populate('tags', 'name avatar username');

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