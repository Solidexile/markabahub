const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Story = sequelize.define('Story', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  media: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
  },
  caption: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  viewers: {
    type: DataTypes.JSON, // Array of { userId, viewedAt }
    defaultValue: [],
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Story;