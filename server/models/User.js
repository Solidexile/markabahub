const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.provider;
    }
  },
  username: {
    type: String,
    unique: true,
    trim: true
  },
  avatar: {
    type: String,
    default: '/default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: 250,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  birthDate: {
    type: Date
  },
  provider: {
    type: String,
    enum: ['google', 'facebook', 'email'],
    default: 'email'
  },
  uid: {
    type: String // For OAuth providers
  },
  verified: {
    type: Boolean,
    default: false
  },
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    friendListVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    }
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  verified: {
    type: Boolean,
    default: false
  },
  // Add business profile fields
  businessProfile: {
    businessName: { type: String, trim: true, default: '' },
    businessDescription: { type: String, trim: true, default: '' },
    businessLogo: { type: String, default: '' },
    businessWebsite: { type: String, trim: true, default: '' },
    businessLocation: { type: String, trim: true, default: '' },
    isBusinessProfileComplete: { type: Boolean, default: false }
  },
  // Favorites: array of Post IDs
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  // Subscriptions: array of User IDs
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Marketplace Favorites: array of MarketplaceItem IDs
  marketplaceFavorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceItem' }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for profile URL
UserSchema.virtual('profileUrl').get(function() {
  return `/profile/${this.username}`;
});

// Update timestamps on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);