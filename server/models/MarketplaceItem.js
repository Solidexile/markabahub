const mongoose = require('mongoose');

const MarketplaceItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'furniture', 'clothing', 'vehicles', 'property', 'services', 'other']
  },
  images: [{
    type: String,
    required: true
  }],
  location: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'used'
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MarketplaceItem', MarketplaceItemSchema);