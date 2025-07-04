const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MarketplaceItem = sequelize.define('MarketplaceItem', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('electronics', 'furniture', 'clothing', 'vehicles', 'property', 'services', 'other'),
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON, // Array of image URLs
    defaultValue: [],
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  condition: {
    type: DataTypes.ENUM('new', 'used', 'refurbished'),
    defaultValue: 'used',
  },
  status: {
    type: DataTypes.ENUM('available', 'pending', 'sold'),
    defaultValue: 'available',
  },
}, {
  timestamps: true,
});

module.exports = MarketplaceItem;