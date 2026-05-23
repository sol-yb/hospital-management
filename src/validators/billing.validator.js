const validator = require('validator');

function validateBilling(action) {
  return (req, res, next) => {
    const errors = [];
    if (action === 'invoice') {
      if (!req.body.patientId) errors.push({ field: 'patientId', message: 'Patient is required' });
      if (!Array.isArray(req.body.items) || req.body.items.length === 0) errors.push({ field: 'items', message: 'At least one invoice item is required' });
      if (req.body.items && req.body.items.some((item) => !item.description || typeof item.amount !== 'number')) {
        errors.push({ field: 'items', message: 'Invoice items must include description and numeric amount' });
      }
    }
    if (action === 'payment') {
      if (!req.body.amount || typeof req.body.amount !== 'number' || req.body.amount <= 0) errors.push({ field: 'amount', message: 'Valid payment amount is required' });
      if (!req.body.method) errors.push({ field: 'method', message: 'Payment method is required' });
    }
    if (action === 'refund') {
      if (!req.body.amount || typeof req.body.amount !== 'number' || req.body.amount <= 0) errors.push({ field: 'amount', message: 'Valid refund amount is required' });
      if (!req.body.reason) errors.push({ field: 'reason', message: 'Refund reason is required' });
    }
    req.validationErrors = errors;
    next();
  };
}

module.exports = { validateBilling };
