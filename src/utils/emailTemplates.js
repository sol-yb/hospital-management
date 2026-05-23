function buildVerificationEmail(token) {
  return `<h1>Verify your account</h1><p>Click the link below to verify your account:</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:4000'}/api/auth/verify-email/${token}">Verify Email</a></p>`;
}

function buildResetEmail(token) {
  return `<h1>Password reset requested</h1><p>Use the token below to reset your password:</p><p><strong>${token}</strong></p>`;
}

function buildAppointmentEmail(appointment, event) {
  const action = event.replace('appointment.', '').replace('-', ' ');
  return `<h1>Appointment ${action}</h1><p>Your appointment is now ${appointment.status}.</p><p>Scheduled for: ${new Date(appointment.scheduledAt).toLocaleString()}</p>`;
}

module.exports = { buildVerificationEmail, buildResetEmail, buildAppointmentEmail };
