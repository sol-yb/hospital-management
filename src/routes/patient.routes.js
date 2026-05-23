const express = require('express');
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { uploadSingle } = require('../middleware/upload.middleware');
const { validatePatient } = require('../validators/patient.validator');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();
router.use(authenticate);
router.post('/', authorize(['patient', 'receptionist', 'super-admin']), validatePatient('create'), validateRequest, patientController.createPatient);
router.get('/', authorize(['super-admin', 'doctor', 'nurse', 'receptionist']), patientController.searchPatients);
router.post('/upload-photo', authorize(['patient', 'receptionist']), uploadSingle('profileImage'), patientController.uploadPatientPhoto);

module.exports = router;
