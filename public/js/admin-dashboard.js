document.addEventListener('DOMContentLoaded', () => {
  if (!window.io) return;

  const liveFeed = document.getElementById('liveActivityFeed');
  const modal = document.getElementById('liveUpdateToast');
  const confirmedCount = document.getElementById('confirmedCount');
  const pendingCount = document.getElementById('pendingCount');
  const cancelledCount = document.getElementById('cancelledCount');
  const chartConfirmed = document.getElementById('chartConfirmed');
  const chartPending = document.getElementById('chartPending');
  const chartCancelled = document.getElementById('chartCancelled');

  const socket = io();
  socket.emit('joinAdminDashboard');

  socket.on('appointmentUpdate', ({ event, appointment }) => {
    const time = new Intl.DateTimeFormat([], { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date());
    const item = document.createElement('li');
    item.className = 'feed-item';
    item.innerHTML = `
      <span class="feed-time">${time}</span>
      <span><strong>${event}</strong> for <em>${appointment.department}</em> appointment with <strong>${appointment.doctor}</strong></span>
    `;
    liveFeed.prepend(item);
    if (liveFeed.children.length > 6) liveFeed.removeChild(liveFeed.lastElementChild);

    if (modal) {
      modal.textContent = `Live update: ${event} — ${appointment.department} appointment updated.`;
      modal.classList.add('visible');
      window.setTimeout(() => modal.classList.remove('visible'), 4200);
    }

    const updateCard = (element, value) => {
      if (!element) return;
      element.textContent = value;
    };

    const updateChart = (element, value) => {
      if (!element) return;
      element.style.width = `${Math.min(100, value)}%`;
    };

    if (appointment.status === 'confirmed') {
      updateCard(confirmedCount, Number(confirmedCount.textContent || 0) + 1);
      updateChart(chartConfirmed, Number(chartConfirmed.dataset.current || 0) + 1);
      chartConfirmed.dataset.current = Number(chartConfirmed.dataset.current || 0) + 1;
    }
    if (appointment.status === 'pending') {
      updateCard(pendingCount, Number(pendingCount.textContent || 0) + 1);
      updateChart(chartPending, Number(chartPending.dataset.current || 0) + 1);
      chartPending.dataset.current = Number(chartPending.dataset.current || 0) + 1;
    }
    if (appointment.status === 'cancelled') {
      updateCard(cancelledCount, Number(cancelledCount.textContent || 0) + 1);
      updateChart(chartCancelled, Number(chartCancelled.dataset.current || 0) + 1);
      chartCancelled.dataset.current = Number(chartCancelled.dataset.current || 0) + 1;
    }
  });

  const chartCanvas = document.getElementById('adminTrendChart');
  if (chartCanvas && chartCanvas.getContext) {
    const ctx = chartCanvas.getContext('2d');
    const confirmed = Number(chartCanvas.dataset.confirmed || 0);
    const pending = Number(chartCanvas.dataset.pending || 0);
    const cancelled = Number(chartCanvas.dataset.cancelled || 0);
    const values = [confirmed, pending, cancelled];
    const labels = ['Confirmed', 'Pending', 'Cancelled'];
    const colors = ['#2563eb', '#a5b4fc', '#ef4444'];
    const maxValue = Math.max(...values, 1);
    const padding = 40;
    const chartWidth = chartCanvas.width - padding * 2;
    const chartHeight = chartCanvas.height - padding * 2;
    const pointGap = chartWidth / (values.length - 1 || 1);

    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(chartCanvas.width - padding, y);
      ctx.stroke();
    }

    values.forEach((value, index) => {
      const x = padding + pointGap * index;
      const y = padding + chartHeight - (value / maxValue) * chartHeight;
      ctx.fillStyle = colors[index];
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (index > 0) {
        const prevX = padding + pointGap * (index - 1);
        const prevY = padding + chartHeight - (values[index - 1] / maxValue) * chartHeight;
        ctx.strokeStyle = colors[index];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });

    ctx.font = '13px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#475569';
    labels.forEach((label, index) => {
      const x = padding + pointGap * index;
      ctx.fillText(label, x - 24, chartCanvas.height - 14);
    });
  }
});
