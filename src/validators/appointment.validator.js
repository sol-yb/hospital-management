const validator = require('validator');

function validateAppointment(action) {
  return (req, res, next) => {
    const errors = [];
    if (action === 'book') {
      if (!req.body.patientId) errors.push({ field: 'patientId', message: 'Patient is required' });
      if (!req.body.doctorId) errors.push({ field: 'doctorId', message: 'Doctor is required' });
      if (!req.body.department) errors.push({ field: 'department', message: 'Department is required' });
      if (!req.body.scheduledAt || !validator.isISO8601(req.body.scheduledAt)) errors.push({ field: 'scheduledAt', message: 'Valid scheduled date is required' });
      if (!['routine', 'urgent', 'emergency'].includes(req.body.priority)) errors.push({ field: 'priority', message: 'Priority must be routine, urgent, or emergency' });
    }
    if (action === 'reschedule') {
      if (!req.body.scheduledAt || !validator.isISO8601(req.body.scheduledAt)) errors.push({ field: 'scheduledAt', message: 'Valid scheduled date is required' });
      if (!req.body.reason) errors.push({ field: 'reason', message: 'Reschedule reason is required' });
    }
    if (action === 'cancel') {
      if (!req.body.cancelReason) errors.push({ field: 'cancelReason', message: 'Cancellation reason is required' });
    }
    req.validationErrors = errors;
    next();
  };
}

module.exports = { validateAppointment };
