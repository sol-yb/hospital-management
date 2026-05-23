const Patient = require('../models/Patient');
const { successResponse } = require('../utils/apiResponse');

async function createPatient(req, res, next) {
  try {
    const data = { ...req.body, user: req.user.id };
    const patient = await Patient.create(data);
    return res.status(201).json(successResponse('Patient profile created', patient));
  } catch (error) {
    return next(error);
  }
}

async function searchPatients(req, res, next) {
  try {
    const filters = {};
    if (req.query.bloodGroup) filters.bloodGroup = req.query.bloodGroup;
    if (req.query.department) filters['insurance.provider'] = req.query.department;
    const patients = await Patient.find(filters).populate('user', 'name email');
    return res.status(200).json(successResponse('Patients retrieved', patients));
  } catch (error) {
    return next(error);
  }
}

async function uploadPatientPhoto(req, res, next) {
  try {
    const patient = await Patient.findOneAndUpdate(
      { user: req.user.id },
      { profileImage: req.file?.path || '' },
      { new: true }
    );
    return res.status(200).json(successResponse('Profile image uploaded', patient));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPatient,
  searchPatients,
  uploadPatientPhoto,
};
