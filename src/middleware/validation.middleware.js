function validateRequest(req, res, next) {
  const errors = req.validationErrors || [];
  if (errors.length) {
    return res.status(422).json({ error: 'Validation failed', details: errors });
  }
  next();
}

module.exports = { validateRequest };
