const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  relation: String,
  phone: String,
  email: String,
});

const insuranceSchema = new mongoose.Schema({
  provider: String,
  policyNumber: String,
  coverageDetails: String,
  validUntil: Date,
});

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, trim: true },
  allergies: [String],
  medicalHistory: [String],
  emergencyContacts: [contactSchema],
  insurance: insuranceSchema,
  profileImage: String,
  visitHistory: [
    {
      reason: String,
      admittedAt: Date,
      dischargedAt: Date,
      summary: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
