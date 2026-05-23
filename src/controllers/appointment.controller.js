const appointmentService = require('../services/appointment.service');
const { successResponse } = require('../utils/apiResponse');

async function book(req, res, next) {
  try {
    const appointment = await appointmentService.bookAppointment({
      patientId: req.body.patientId,
      doctorId: req.body.doctorId,
      department: req.body.department,
      scheduledAt: req.body.scheduledAt,
      priority: req.body.priority,
      reason: req.body.reason,
      createdBy: req.user.id,
    });
    return res.status(201).json(successResponse('Appointment booked successfully', appointment));
  } catch (error) {
    return next(error);
  }
}

async function reschedule(req, res, next) {
  try {
    const appointment = await appointmentService.rescheduleAppointment(req.params.id, req.body.scheduledAt, req.body.reason, req.user.id);
    return res.status(200).json(successResponse('Appointment rescheduled', appointment));
  } catch (error) {
    return next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id, req.body.cancelReason, req.user.id);
    return res.status(200).json(successResponse('Appointment cancelled', appointment));
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const filter = {};
    if (req.query.doctorId) filter.doctor = req.query.doctorId;
    if (req.query.patientId) filter.patient = req.query.patientId;
    if (req.query.status) filter.status = req.query.status;
    const options = { limit: Number(req.query.limit) || 50, skip: Number(req.query.skip) || 0, populate: ['patient', 'doctor'] };
    const appointments = await appointmentService.getAppointments(filter, options);
    return res.status(200).json(successResponse('Appointments fetched', appointments));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  book,
  reschedule,
  cancel,
  list,
};
