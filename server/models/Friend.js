const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Friend = sequelize.define('Friend', {
  requester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipient: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'blocked'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['requester', 'recipient']
    }
  ]
});

module.exports = Friend;