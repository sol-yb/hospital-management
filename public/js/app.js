document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('hms-theme');
  if (storedTheme) {
    root.dataset.theme = storedTheme;
    themeToggle.textContent = storedTheme === 'dark' ? '☀️' : '🌙';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('hms-theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  const formMessages = document.querySelectorAll('.form-message');
  document.querySelectorAll('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const required = Array.from(form.querySelectorAll('[required]'));
      const invalid = required.filter((input) => !input.value.trim());
      if (invalid.length > 0) {
        event.preventDefault();
        const message = form.querySelector('.form-message');
        if (message) {
          message.textContent = 'Please complete all required fields before continuing.';
          message.classList.add('error');
        }
        invalid[0].focus();
      }
    });
  });

  const path = window.location.pathname;
  document.querySelectorAll('.site-nav .nav-link').forEach((link) => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
});
