const User = require('../models/User');

function findByEmail(email) {
  return User.findOne({ email });
}

function findById(id) {
  return User.findById(id);
}

module.exports = { findByEmail, findById };
