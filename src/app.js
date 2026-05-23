const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const xss = require('xss-clean');
const rateLimit = require('./middleware/rateLimiter.middleware');
const { loadEnv } = require('./config/env');
const { globalErrorHandler } = require('./middleware/error.middleware');
const routes = require('./routes/index.routes');
const pagesRoutes = require('./routes/pages.routes');

loadEnv();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(xss());
app.use(rateLimit);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const csrfProtection = csurf({ cookie: true });
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  return csrfProtection(req, res, next);
});

app.use((req, res, next) => {
  if (req.csrfToken) res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/api', routes);
app.use('/', pagesRoutes);
app.get('/', (req, res) => res.render('pages/home', { title: 'Hospital Management System' }));
app.use(globalErrorHandler);

module.exports = app;
