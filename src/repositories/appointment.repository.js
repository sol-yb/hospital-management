const Appointment = require('../models/Appointment');

function findByDoctorAndTime(doctorId, scheduledAt) {
  return Appointment.findOne({ doctor: doctorId, scheduledAt, status: { $ne: 'cancelled' } });
}

function list(filter, options) {
  return Appointment.find(filter).limit(options.limit).skip(options.skip);
}

module.exports = { findByDoctorAndTime, list };
