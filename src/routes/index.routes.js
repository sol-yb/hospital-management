const express = require('express');
const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const appointmentRoutes = require('./appointment.routes');
const billingRoutes = require('./billing.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/billing', billingRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
