const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { successResponse } = require('../utils/apiResponse');

async function getDashboardStats(req, res, next) {
  try {
    const totalUsers = await User.countDocuments();
    const activeAppointments = await Appointment.countDocuments({ status: { $in: ['pending', 'confirmed', 'in-progress'] } });
    const revenue = await Invoice.aggregate([{ $group: { _id: null, total: { $sum: '$paid' } } }]);
    const auditCount = await ActivityLog.countDocuments();
    return res.status(200).json(successResponse('Dashboard stats loaded', {
      totalUsers,
      activeAppointments,
      revenue: revenue[0]?.total || 0,
      auditCount,
    }));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDashboardStats,
};
