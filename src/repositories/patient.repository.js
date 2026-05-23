const Patient = require('../models/Patient');

function create(data) {
  return Patient.create(data);
}

function search(filter) {
  return Patient.find(filter).populate('user', 'name email');
}

module.exports = { create, search };
