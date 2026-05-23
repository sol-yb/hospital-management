const Appointment = require('../models/Appointment');
const { sendAppointmentNotification } = require('../services/notification.service');

async function sendUpcomingReminders() {
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  const appointments = await Appointment.find({
    scheduledAt: { $gte: now, $lte: nextHour },
    status: 'confirmed',
    remindersSent: { $lt: 1 },
  }).populate('patient');

  for (const appointment of appointments) {
    appointment.remindersSent += 1;
    await appointment.save();
    await sendAppointmentNotification(appointment, 'appointment.reminder');
  }
}

function startReminderJob() {
  setInterval(() => {
    sendUpcomingReminders().catch((err) => {
      console.error('Reminder job failed', err);
    });
  }, 1000 * 60 * 10);
}

module.exports = { startReminderJob, sendUpcomingReminders };
