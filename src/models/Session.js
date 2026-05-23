const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  device: String,
  ipAddress: String,
  valid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

sessionSchema.index({ refreshToken: 1 }, { unique: true });

module.exports = mongoose.model('Session', sessionSchema);
