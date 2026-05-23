const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  ipAddress: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
