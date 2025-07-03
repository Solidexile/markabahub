const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    required: true
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

// Compound index to ensure unique friend requests
FriendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Update the updatedAt field on save
FriendSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get friend status between two users
FriendSchema.statics.getFriendStatus = async function(user1, user2) {
  const friendship = await this.findOne({
    $or: [
      { requester: user1, recipient: user2 },
      { requester: user2, recipient: user1 }
    ]
  });
  
  return friendship ? friendship.status : 'none';
};

module.exports = mongoose.model('Friend', FriendSchema);