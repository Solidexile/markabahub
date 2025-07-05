const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Notification = sequelize.define('Notification', {
  recipient: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sender: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('like', 'comment', 'friend_request', 'message', 'mention', 'post_share'),
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  relatedItem: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be post ID, comment ID, etc.
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['recipient', 'read', 'createdAt']
    }
  ]
});

module.exports = Notification;