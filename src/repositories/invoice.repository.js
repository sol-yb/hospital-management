const Invoice = require('../models/Invoice');

function findById(id) {
  return Invoice.findById(id);
}

function create(invoice) {
  return Invoice.create(invoice);
}

module.exports = { findById, create };
