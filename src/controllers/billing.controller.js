const billingService = require('../services/billing.service');
const { successResponse } = require('../utils/apiResponse');

async function createInvoice(req, res, next) {
  try {
    const invoice = await billingService.createInvoice({
      patientId: req.body.patientId,
      appointmentId: req.body.appointmentId,
      doctorId: req.body.doctorId,
      items: req.body.items,
      notes: req.body.notes,
    });
    return res.status(201).json(successResponse('Invoice generated', invoice));
  } catch (error) {
    return next(error);
  }
}

async function payInvoice(req, res, next) {
  try {
    const invoice = await billingService.recordPayment(req.params.id, {
      amount: req.body.amount,
      method: req.body.method,
      reference: req.body.reference,
    });
    return res.status(200).json(successResponse('Payment recorded', invoice));
  } catch (error) {
    return next(error);
  }
}

async function refund(req, res, next) {
  try {
    const invoice = await billingService.refundInvoice(req.params.id, req.body.amount, req.body.reason);
    return res.status(200).json(successResponse('Refund processed', invoice));
  } catch (error) {
    return next(error);
  }
}

async function analytics(req, res, next) {
  try {
    const data = await billingService.getRevenueAnalytics();
    return res.status(200).json(successResponse('Revenue analytics retrieved', data));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createInvoice,
  payInvoice,
  refund,
  analytics,
};
