const Invoice = require('../models/Invoice');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

function calculateTax(subtotal, rate = 0.12) {
  return Number((subtotal * rate).toFixed(2));
}

async function createInvoice({ patientId, appointmentId, doctorId, items, notes }) {
  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error('Patient not found');

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const invoice = new Invoice({
    patient: patientId,
    appointment: appointmentId,
    doctor: doctorId,
    items,
    subtotal,
    tax,
    total,
    notes,
    status: 'issued',
  });
  await invoice.save();
  return invoice;
}

async function recordPayment(invoiceId, payment) {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new Error('Invoice not found');
  invoice.payments.push(payment);
  invoice.paid += payment.amount;
  invoice.status = invoice.paid >= invoice.total ? 'paid' : 'issued';
  await invoice.save();
  return invoice;
}

async function refundInvoice(invoiceId, amount, reason) {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new Error('Invoice not found');
  invoice.paid = Math.max(0, invoice.paid - amount);
  invoice.status = invoice.paid >= invoice.total ? 'paid' : 'refunded';
  invoice.notes = `${invoice.notes || ''}\nRefund: ${amount} reason: ${reason}`;
  await invoice.save();
  return invoice;
}

async function getRevenueAnalytics() {
  const pipeline = [
    { $match: { status: { $in: ['paid', 'issued', 'refunded'] } } },
    { $group: { _id: '$doctor', revenue: { $sum: '$paid' }, totalInvoices: { $sum: 1 } } },
  ];
  return Invoice.aggregate(pipeline);
}

module.exports = {
  createInvoice,
  recordPayment,
  refundInvoice,
  calculateTax,
  getRevenueAnalytics,
};
