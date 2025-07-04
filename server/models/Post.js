const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Post = sequelize.define('Post', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  businessId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null if not a business post
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON, // Array of image URLs
    defaultValue: [],
  },
  privacy: {
    type: DataTypes.ENUM('public', 'friends', 'private'),
    defaultValue: 'public',
  },
  tags: {
    type: DataTypes.JSON, // Array of tag user IDs
    defaultValue: [],
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Post;