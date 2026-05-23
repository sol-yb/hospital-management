const Doctor = require('../models/Doctor');

function findById(id) {
  return Doctor.findById(id);
}

function list(criteria) {
  return Doctor.find(criteria);
}

module.exports = { findById, list };
