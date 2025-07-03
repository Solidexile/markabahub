const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const MarketplaceItem = require('../models/MarketplaceItem');

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public/Private (depending on privacy settings)
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username })
    .select('-password')
    .populate('friends', 'name avatar username');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check privacy settings
  if (user.privacy.profileVisibility === 'private' && 
      (!req.user || req.user.id !== user.id)) {
    return next(new ErrorResponse('Not authorized to view this profile', 401));
  }

  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  // Check if user is updating their own profile
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized to update this profile', 401));
  }

  const { name, bio, location, website, birthDate, privacy } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name,
      bio,
      location,
      website,
      birthDate,
      privacy
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json(user);
});

// @desc    Upload profile picture
// @route   PUT /api/users/:id/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized to update this profile', 401));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { avatar: req.file.path },
    { new: true }
  ).select('-password');

  res.json(user);
});

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Public
exports.searchUsers = asyncHandler(async (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } }
    ]
  }).select('name avatar username');

  res.json(users);
});

// @desc    Update business profile
// @route   PUT /api/users/:id/business-profile
// @access  Private
exports.updateBusinessProfile = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized to update this business profile', 401));
  }

  const { businessName, businessDescription, businessLogo, businessWebsite, businessLocation } = req.body;

  const update = {
    'businessProfile.businessName': businessName,
    'businessProfile.businessDescription': businessDescription,
    'businessProfile.businessLogo': businessLogo,
    'businessProfile.businessWebsite': businessWebsite,
    'businessProfile.businessLocation': businessLocation,
    'businessProfile.isBusinessProfileComplete': !!(businessName && businessDescription)
  };

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true, runValidators: true }
  ).select('-password');

  res.json(user);
});

// @desc    Add a post to favorites
// @route   POST /api/users/:id/favorites/:postId
// @access  Private
exports.addFavorite = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id);
  if (!user.favorites.includes(req.params.postId)) {
    user.favorites.push(req.params.postId);
    await user.save();
  }
  res.json(user);
});

// @desc    Remove a post from favorites
// @route   DELETE /api/users/:id/favorites/:postId
// @access  Private
exports.removeFavorite = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id);
  user.favorites = user.favorites.filter(
    postId => postId.toString() !== req.params.postId
  );
  await user.save();
  res.json(user);
});

// @desc    Get all favorite posts
// @route   GET /api/users/:id/favorites
// @access  Private
exports.getFavorites = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id).populate('favorites');
  res.json(user.favorites);
});

// @desc    Subscribe to a user
// @route   POST /api/users/:id/subscribe/:targetId
// @access  Private
exports.subscribeToUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id);
  if (!user.subscriptions.includes(req.params.targetId)) {
    user.subscriptions.push(req.params.targetId);
    await user.save();
  }
  res.json(user);
});

// @desc    Unsubscribe from a user
// @route   DELETE /api/users/:id/subscribe/:targetId
// @access  Private
exports.unsubscribeFromUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id);
  user.subscriptions = user.subscriptions.filter(
    uid => uid.toString() !== req.params.targetId
  );
  await user.save();
  res.json(user);
});

// @desc    Get all subscriptions
// @route   GET /api/users/:id/subscriptions
// @access  Private
exports.getSubscriptions = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id).populate('subscriptions');
  res.json(user.subscriptions);
});

// @desc    Add a marketplace item to favorites
// @route   POST /api/users/:id/marketplace-favorites/:itemId
// @access  Private
exports.addMarketplaceFavorite = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id);
  if (!user.marketplaceFavorites.includes(req.params.itemId)) {
    user.marketplaceFavorites.push(req.params.itemId);
    await user.save();
  }
  res.json(user);
});

// @desc    Remove a marketplace item from favorites
// @route   DELETE /api/users/:id/marketplace-favorites/:itemId
// @access  Private
exports.removeMarketplaceFavorite = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id);
  user.marketplaceFavorites = user.marketplaceFavorites.filter(
    itemId => itemId.toString() !== req.params.itemId
  );
  await user.save();
  res.json(user);
});

// @desc    Get all favorite marketplace items
// @route   GET /api/users/:id/marketplace-favorites
// @access  Private
exports.getMarketplaceFavorites = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  const user = await User.findById(req.params.id).populate('marketplaceFavorites');
  res.json(user.marketplaceFavorites);
});