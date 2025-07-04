const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // allow null for OAuth
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '/default-avatar.png',
  },
  bio: {
    type: DataTypes.STRING(250),
    defaultValue: '',
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  website: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  provider: {
    type: DataTypes.ENUM('local', 'google', 'facebook'),
    defaultValue: 'local',
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  profileVisibility: {
    type: DataTypes.ENUM('public', 'friends', 'private'),
    defaultValue: 'public',
  },
  friendListVisibility: {
    type: DataTypes.ENUM('public', 'friends', 'private'),
    defaultValue: 'public',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  businessName: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  businessDescription: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  businessLogo: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  businessWebsite: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  businessLocation: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isBusinessProfileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  businessPhone: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  businessBanner: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  timestamps: true,
});

module.exports = User;