const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

function startOfDay(date = new Date()) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date = new Date()) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

async function getDashboardStats() {
  const todayStart = startOfDay();
  const todayEnd = endOfDay();

  const [totalPatients, totalDoctors, totalUsers, totalInvoices, overdueInvoices, confirmedAppointments, pendingAppointments, cancelledAppointments, todayAppointments] = await Promise.all([
    Patient.countDocuments(),
    User.countDocuments({ role: 'doctor' }),
    User.countDocuments(),
    Invoice.countDocuments(),
    Invoice.countDocuments({ status: 'overdue' }),
    Appointment.countDocuments({ status: 'confirmed' }),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({ status: 'cancelled' }),
    Appointment.countDocuments({ scheduledAt: { $gte: todayStart, $lte: todayEnd }, status: { $nin: ['cancelled'] } }),
  ]);

  const recentAppointments = await Appointment.find({ status: { $nin: ['cancelled'] } })
    .sort({ scheduledAt: 1 })
    .limit(5)
    .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
    .populate('doctor');

  const recentActivity = await Appointment.find({})
    .sort({ updatedAt: -1 })
    .limit(6)
    .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
    .populate('doctor');

  return {
    stats: {
      totalPatients,
      totalDoctors,
      totalUsers,
      totalInvoices,
      overdueInvoices,
      confirmedAppointments,
      pendingAppointments,
      cancelledAppointments,
      todayAppointments,
    },
    chartData: {
      confirmed: confirmedAppointments,
      pending: pendingAppointments,
      cancelled: cancelledAppointments,
    },
    upcomingAppointments: recentAppointments.map((appointment) => ({
      patientName: appointment.patient?.user?.name || 'Unknown patient',
      doctorName: appointment.doctor?.name || 'Unknown doctor',
      scheduledAt: appointment.scheduledAt,
      department: appointment.department,
      status: appointment.status,
    })),
    recentActivity: recentActivity.map((appointment) => ({
      event: appointment.status === 'confirmed' ? 'Confirmed' : appointment.status === 'cancelled' ? 'Cancelled' : appointment.status === 'completed' ? 'Completed' : 'Updated',
      appointmentId: appointment._id.toString(),
      patientName: appointment.patient?.user?.name || 'Patient',
      doctorName: appointment.doctor?.name || 'Doctor',
      status: appointment.status,
      updatedAt: appointment.updatedAt,
    })),
  };
}

module.exports = { getDashboardStats };
