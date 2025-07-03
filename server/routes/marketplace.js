const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getItemsByUser
} = require('../controllers/marketplaceController');
const { protect } = require('../middleware/auth');

// POST /api/marketplace
router.post(
  '/',
  [
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric(),
      check('category', 'Category is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty()
    ]
  ],
  createItem
);

// GET /api/marketplace
router.get('/', getAllItems);

// GET /api/marketplace/:id
router.get('/:id', getItemById);

// PUT /api/marketplace/:id
router.put('/:id', protect, updateItem);

// DELETE /api/marketplace/:id
router.delete('/:id', protect, deleteItem);

// GET /api/marketplace/user/:userId
router.get('/user/:userId', getItemsByUser);

module.exports = router;