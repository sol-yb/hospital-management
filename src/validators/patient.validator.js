const validator = require('validator');

function validatePatient(action) {
  return (req, res, next) => {
    const errors = [];
    if (action === 'create') {
      if (!req.body.bloodGroup) errors.push({ field: 'bloodGroup', message: 'Blood group is required' });
      if (!req.body.medicalHistory || !Array.isArray(req.body.medicalHistory)) errors.push({ field: 'medicalHistory', message: 'Medical history must be an array' });
      if (!req.body.emergencyContacts || !Array.isArray(req.body.emergencyContacts)) errors.push({ field: 'emergencyContacts', message: 'Emergency contacts are required' });
      if (req.body.emergencyContacts && req.body.emergencyContacts.some((contact) => !contact.name || !contact.phone)) {
        errors.push({ field: 'emergencyContacts', message: 'Each emergency contact requires name and phone' });
      }
    }
    req.validationErrors = errors;
    next();
  };
}

module.exports = { validatePatient };
