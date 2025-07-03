const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  media: {
    type: String, // URL to image/video
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  caption: {
    type: String,
    maxlength: 200
  },
  viewers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for expiration
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for viewer count
StorySchema.virtual('viewCount').get(function() {
  return this.viewers.length;
});

// Method to check if user has viewed the story
StorySchema.methods.hasViewed = function(userId) {
  return this.viewers.some(viewer => viewer.user.toString() === userId);
};

module.exports = mongoose.model('Story', StorySchema);