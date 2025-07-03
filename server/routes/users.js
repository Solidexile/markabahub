const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Update business profile
router.put('/:id/business-profile', protect, userController.updateBusinessProfile);

// Favorites
router.post('/:id/favorites/:postId', protect, userController.addFavorite);
router.delete('/:id/favorites/:postId', protect, userController.removeFavorite);
router.get('/:id/favorites', protect, userController.getFavorites);

// Subscriptions
router.post('/:id/subscribe/:targetId', protect, userController.subscribeToUser);
router.delete('/:id/subscribe/:targetId', protect, userController.unsubscribeFromUser);
router.get('/:id/subscriptions', protect, userController.getSubscriptions);

// Marketplace Favorites
router.post('/:id/marketplace-favorites/:itemId', protect, userController.addMarketplaceFavorite);
router.delete('/:id/marketplace-favorites/:itemId', protect, userController.removeMarketplaceFavorite);
router.get('/:id/marketplace-favorites', protect, userController.getMarketplaceFavorites);

// Add at the end:
router.get('/:username', userController.getUserProfile);

module.exports = router;
