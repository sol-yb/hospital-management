const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { sendAppointmentNotification } = require('./notification.service');
const { publishAppointmentUpdate } = require('../sockets/appointment.socket');

async function bookAppointment({ patientId, doctorId, department, scheduledAt, priority, reason, createdBy }) {
  const scheduledDate = new Date(scheduledAt);
  if (scheduledDate < new Date()) throw new Error('Appointment must be scheduled in the future');

  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error('Patient profile not found');

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error('Doctor profile not found');
  if (priority === 'emergency') {
    await shiftQueueForEmergency(doctorId, scheduledDate);
  }

  const conflict = await Appointment.findOne({ doctor: doctorId, scheduledAt: scheduledDate, status: { $ne: 'cancelled' } });
  if (conflict) throw new Error('Doctor already has an appointment at this time');

  const queuePosition = await Appointment.countDocuments({ doctor: doctorId, scheduledAt: { $gte: scheduledDate }, status: 'confirmed' }) + 1;
  const appointment = new Appointment({
    patient: patientId,
    doctor: doctorId,
    department,
    scheduledAt: scheduledDate,
    priority,
    reason,
    queuePosition,
    createdBy,
    status: 'confirmed',
  });

  await appointment.save();
  await sendAppointmentNotification(appointment, 'appointment.created');
  publishAppointmentUpdate(appointment, 'appointment.created');
  return appointment;
}

async function shiftQueueForEmergency(doctorId, scheduledAt) {
  await Appointment.updateMany(
    { doctor: doctorId, scheduledAt: { $gte: scheduledAt }, status: 'confirmed' },
    { $inc: { queuePosition: 1 } }
  );
}

async function rescheduleAppointment(appointmentId, newDate, reason, userId) {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error('Appointment not found');
  if (appointment.status === 'cancelled') throw new Error('Cannot reschedule a cancelled appointment');

  const scheduledDate = new Date(newDate);
  const conflict = await Appointment.findOne({ doctor: appointment.doctor, scheduledAt: scheduledDate, status: { $ne: 'cancelled' }, _id: { $ne: appointmentId } });
  if (conflict) throw new Error('Doctor not available at the requested time');

  appointment.scheduledAt = scheduledDate;
  appointment.notes.push(`Rescheduled by ${userId} for reason: ${reason}`);
  await appointment.save();
  await sendAppointmentNotification(appointment, 'appointment.rescheduled');
  publishAppointmentUpdate(appointment, 'appointment.rescheduled');
  return appointment;
}

async function cancelAppointment(appointmentId, cancellationReason, userId) {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error('Appointment not found');
  appointment.status = 'cancelled';
  appointment.cancellationReason = cancellationReason;
  appointment.notes.push(`Cancelled by ${userId}: ${cancellationReason}`);
  await appointment.save();
  await sendAppointmentNotification(appointment, 'appointment.cancelled');
  publishAppointmentUpdate(appointment, 'appointment.cancelled');
  return appointment;
}

async function getAppointments(filter = {}, options = {}) {
  const query = Appointment.find(filter).sort({ scheduledAt: 1 });
  if (options.limit) query.limit(options.limit);
  if (options.skip) query.skip(options.skip);
  if (options.populate) query.populate(options.populate);
  return query;
}

module.exports = {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getAppointments,
};
