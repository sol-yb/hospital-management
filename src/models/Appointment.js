const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  department: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'], default: 'pending' },
  priority: { type: String, enum: ['routine', 'urgent', 'emergency'], default: 'routine' },
  reason: String,
  cancellationReason: String,
  queuePosition: Number,
  remindersSent: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [String],
}, { timestamps: true });

appointmentSchema.index({ doctor: 1, scheduledAt: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
