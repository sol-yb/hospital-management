const { Server } = require('socket.io');

let io;

function initSockets(server) {
  io = new Server(server, {
    cors: { origin: true, credentials: true },
  });

  io.on('connection', (socket) => {
    socket.on('joinDepartment', (department) => {
      socket.join(`department-${department}`);
    });

    socket.on('joinAppointment', (appointmentId) => {
      socket.join(`appointment-${appointmentId}`);
    });

    socket.on('joinAdminDashboard', () => {
      socket.join('admin-dashboard');
    });

    socket.on('disconnect', () => {
      // cleanup if required
    });
  });
}

function publishAppointmentUpdate(appointment, event) {
  if (!io) return;
  io.to(`doctor-${appointment.doctor}`).emit('appointmentUpdate', { event, appointment });
  io.to(`appointment-${appointment._id}`).emit('appointmentUpdate', { event, appointment });
  io.to('admin-dashboard').emit('appointmentUpdate', { event, appointment });
}

module.exports = { initSockets, publishAppointmentUpdate };
