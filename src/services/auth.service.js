const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const ActivityLog = require('../models/ActivityLog');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./notification.service');

const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpires = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const refreshExpires = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

async function registerUser(payload) {
  const user = new User(payload);
  await user.save();
  const mailInfo = await sendVerificationEmail(user.email, user.verificationToken);
  await logActivity(user._id, 'user.registered');
  return { user, mailInfo };
}

async function verifyEmail(token) {
  const user = await User.findOne({ verificationToken: token });
  if (!user) throw new Error('Invalid verification token');
  user.emailVerified = true;
  user.verificationToken = null;
  await user.save();
  await logActivity(user._id, 'user.emailVerified');
  return user;
}

async function authenticateUser(email, password, ipAddress, device) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  if (!user.emailVerified) throw new Error('Email not verified. Please verify your email before login.');
  if (user.isLocked) throw new Error('Account locked due to too many failed attempts');
  const matched = await user.comparePassword(password);
  if (!matched) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) user.isLocked = true;
    await user.save();
    await logActivity(user._id, 'user.login.failed', { ipAddress, device });
    throw new Error('Invalid credentials');
  }

  user.loginAttempts = 0;
  user.isLocked = false;
  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const session = new Session({
    user: user._id,
    refreshToken,
    ipAddress,
    device,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await session.save();
  await logActivity(user._id, 'user.login.success', { ipAddress, device });

  return { user, accessToken, refreshToken };
}

function generateAccessToken(user) {
  return jwt.sign({ sub: user._id, role: user.role, email: user.email }, jwtSecret, { expiresIn: accessExpires });
}

function generateRefreshToken(user) {
  return jwt.sign({ sub: user._id, role: user.role, email: user.email }, jwtRefreshSecret, { expiresIn: refreshExpires });
}

async function refreshAccessToken(refreshToken) {
  const payload = jwt.verify(refreshToken, jwtRefreshSecret);
  const session = await Session.findOne({ refreshToken, valid: true, expiresAt: { $gt: new Date() } });
  if (!session) throw new Error('Invalid refresh session');
  const user = await User.findById(payload.sub);
  if (!user) throw new Error('User not found');
  return { accessToken: generateAccessToken(user), user };
}

async function logout(refreshToken) {
  const session = await Session.findOne({ refreshToken, valid: true });
  if (session) {
    session.valid = false;
    await session.save();
    await logActivity(session.user, 'user.logout');
  }
}

async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('No account matches that email');
  user.passwordResetToken = crypto.randomBytes(24).toString('hex');
  user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60);
  await user.save();
  await sendPasswordResetEmail(user.email, user.passwordResetToken);
  await logActivity(user._id, 'user.passwordReset.requested');
}

async function resetPassword(token, newPassword) {
  const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: new Date() } });
  if (!user) throw new Error('Invalid or expired reset token');
  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  await logActivity(user._id, 'user.passwordReset.completed');
}

async function logActivity(userId, action, metadata = {}) {
  await ActivityLog.create({ user: userId, action, metadata });
}

module.exports = {
  registerUser,
  verifyEmail,
  authenticateUser,
  refreshAccessToken,
  logout,
  requestPasswordReset,
  resetPassword,
  generateAccessToken,
};
