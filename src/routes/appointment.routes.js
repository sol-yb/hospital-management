const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validateAppointment } = require('../validators/appointment.validator');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.use(authenticate);
router.post('/', authorize(['patient', 'receptionist', 'doctor', 'super-admin']), validateAppointment('book'), validateRequest, appointmentController.book);
router.put('/:id/reschedule', authorize(['patient', 'receptionist', 'doctor', 'super-admin']), validateAppointment('reschedule'), validateRequest, appointmentController.reschedule);
router.put('/:id/cancel', authorize(['patient', 'receptionist', 'doctor', 'super-admin']), validateAppointment('cancel'), validateRequest, appointmentController.cancel);
router.get('/', authorize(['super-admin', 'doctor', 'nurse', 'receptionist', 'patient']), appointmentController.list);

module.exports = router;
