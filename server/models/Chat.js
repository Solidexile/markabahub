const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Chat = sequelize.define('Chat', {
  participants: {
    type: DataTypes.JSON, // Array of user IDs
    allowNull: false,
  },
  messages: {
    type: DataTypes.JSON, // Array of message objects
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = Chat;