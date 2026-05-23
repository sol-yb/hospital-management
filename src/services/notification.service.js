const nodemailer = require('nodemailer');
const { logger } = require('../config/logger');
const { buildVerificationEmail, buildResetEmail, buildAppointmentEmail } = require('../utils/emailTemplates');

let transporter;
let testMode = false;

async function createTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }

  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    testMode = true;
    logger.warn('SMTP not configured. Using Ethereal test account for email preview.');
    return transporter;
  }

  return null;
}

async function sendMail(message) {
  const transport = await createTransporter();
  if (!transport) {
    logger.warn('SMTP not configured in production; email skipped.');
    return null;
  }

  const info = await transport.sendMail(message);
  if (testMode) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info(`Email preview available at ${previewUrl}`);
      info.previewUrl = previewUrl;
    }
  }
  return info;
}

async function sendVerificationEmail(email, token) {
  const subject = 'Verify your Hospital Management account';
  const html = buildVerificationEmail(token);
  const info = await sendMail({ from: process.env.EMAIL_FROM, to: email, subject, html });
  return info;
}

async function sendPasswordResetEmail(email, token) {
  const subject = 'Reset your Hospital Management password';
  const html = buildResetEmail(token);
  const info = await sendMail({ from: process.env.EMAIL_FROM, to: email, subject, html });
  return info;
}

async function sendAppointmentNotification(appointment, event) {
  const subject = 'Appointment Update';
  const html = buildAppointmentEmail(appointment, event);
  const recipient = appointment.patient?.email || process.env.EMAIL_FROM;
  await sendMail({ from: process.env.EMAIL_FROM, to: recipient, subject, html });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAppointmentNotification,
};
