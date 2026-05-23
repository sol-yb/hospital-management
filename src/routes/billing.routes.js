const express = require('express');
const billingController = require('../controllers/billing.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validateBilling } = require('../validators/billing.validator');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.use(authenticate);
router.post('/', authorize(['super-admin', 'receptionist', 'pharmacist']), validateBilling('invoice'), validateRequest, billingController.createInvoice);
router.post('/:id/pay', authorize(['super-admin', 'receptionist', 'pharmacist']), validateBilling('payment'), validateRequest, billingController.payInvoice);
router.post('/:id/refund', authorize(['super-admin', 'receptionist']), validateBilling('refund'), validateRequest, billingController.refund);
router.get('/analytics', authorize(['super-admin', 'pharmacist']), billingController.analytics);

module.exports = router;
