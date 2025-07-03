const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get news feed
// @route   GET /api/feed
// @access  Private
exports.getNewsFeed = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('friends');
  
  // Get IDs of friends and user themselves
  const friendIds = user.friends.map(friend => friend._id);
  const allUserIds = [...friendIds, req.user.id];

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Get posts from friends and public posts from non-friends
  const posts = await Post.find({
    $or: [
      { user: { $in: allUserIds } }, // Posts from user and friends
      { privacy: 'public' } // Public posts from others
    ]
  })
  .sort('-createdAt')
  .skip(startIndex)
  .limit(limit)
  .populate('user', 'name avatar username')
  .populate('tags', 'name avatar username');

  // Get total count for pagination
  const total = await Post.countDocuments({
    $or: [
      { user: { $in: allUserIds } },
      { privacy: 'public' }
    ]
  });

  res.json({
    success: true,
    count: posts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: posts
  });
});

// @desc    Get trending posts
// @route   GET /api/feed/trending
// @access  Private
exports.getTrendingPosts = asyncHandler(async (req, res, next) => {
  // Get posts with most likes and comments in the last 7 days
  const posts = await Post.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $addFields: {
        engagement: {
          $add: [
            { $size: "$likes" },
            { $size: "$comments" }
          ]
        }
      }
    },
    { $sort: { engagement: -1 } },
    { $limit: 10 }
  ]);

  // Populate user data
  await Post.populate(posts, {
    path: 'user',
    select: 'name avatar username'
  });

  res.json({
    success: true,
    count: posts.length,
    data: posts
  });
});