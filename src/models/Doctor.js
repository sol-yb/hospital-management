const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: { type: String },
  startTime: String,
  endTime: String,
  maxAppointments: { type: Number, default: 12 },
});

const performanceSchema = new mongoose.Schema({
  completedAppointments: { type: Number, default: 0 },
  satisfactionScore: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
});

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: String,
  department: String,
  schedule: [scheduleSchema],
  availability: [{ date: Date, slots: [String] }],
  shift: { type: String, trim: true },
  appointmentLimitPerDay: { type: Number, default: 24 },
  performance: performanceSchema,
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
