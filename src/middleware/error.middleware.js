function globalErrorHandler(err, req, res, next) {
  const status = err.status || 400;
  const message = err.message || 'An error occurred';
  const payload = {
    error: message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  };
  res.status(status).json(payload);
}

module.exports = { globalErrorHandler };
