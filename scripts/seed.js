const mongoose = require('mongoose');
const { connectDatabase } = require('../src/config/db');
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');

async function seed() {
  await connectDatabase();
  await User.deleteMany();
  await Doctor.deleteMany();
  await Patient.deleteMany();

  const admin = await User.create({ name: 'Super Admin', email: 'admin@hospital.local', password: 'Admin1234', role: 'super-admin', emailVerified: true });
  const doctorUser = await User.create({ name: 'Dr. Harris', email: 'doctor@hospital.local', password: 'Doctor1234', role: 'doctor', emailVerified: true });
  const patientUser = await User.create({ name: 'Jane Patient', email: 'jane@hospital.local', password: 'Patient1234', role: 'patient', emailVerified: true });

  await Doctor.create({ user: doctorUser._id, specialization: 'Cardiology', department: 'Cardio', shift: 'morning', schedule: [{ day: 'Monday', startTime: '08:00', endTime: '16:00' }] });
  await Patient.create({ user: patientUser._id, bloodGroup: 'O+', medicalHistory: ['hypertension'], emergencyContacts: [{ name: 'John Patient', relation: 'spouse', phone: '+123456789' }] });

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
