const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: Number,
  method: { type: String, enum: ['cash', 'card', 'insurance', 'online'], default: 'cash' },
  paidAt: { type: Date, default: Date.now },
  reference: String,
});

const lineItemSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  taxRate: Number,
});

const invoiceSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  items: [lineItemSchema],
  subtotal: Number,
  tax: Number,
  total: Number,
  paid: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'issued', 'paid', 'refunded', 'overdue'], default: 'issued' },
  payments: [paymentSchema],
  notes: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
