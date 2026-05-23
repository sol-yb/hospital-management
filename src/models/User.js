const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['super-admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'laboratory-staff', 'patient'],
    default: 'patient',
  },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: () => uuidv4() },
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date,
  loginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
