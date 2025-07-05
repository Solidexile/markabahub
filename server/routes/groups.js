const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

// Get all groups
router.get('/', protect, groupController.getGroups);

// Create a group
router.post('/', protect, groupController.createGroup);

// Get group by ID
router.get('/:id', protect, groupController.getGroup);

// Update group
router.put('/:id', protect, groupController.updateGroup);

// Delete group
router.delete('/:id', protect, groupController.deleteGroup);

module.exports = router;
