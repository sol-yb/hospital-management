const validator = require('validator');

function validateAuth(action) {
  return (req, res, next) => {
    const errors = [];
    const { email, password, name, token } = req.body;
    if (action === 'register') {
      if (!name || validator.isEmpty(name)) errors.push({ field: 'name', message: 'Name is required' });
      if (!email || !validator.isEmail(email)) errors.push({ field: 'email', message: 'Valid email is required' });
      if (!password || !validator.isStrongPassword(password, { minSymbols: 0 })) errors.push({ field: 'password', message: 'Password must be strong' });
    }
    if (action === 'login') {
      if (!email || !validator.isEmail(email)) errors.push({ field: 'email', message: 'Valid email is required' });
      if (!password) errors.push({ field: 'password', message: 'Password is required' });
    }
    if (action === 'forgotPassword') {
      if (!email || !validator.isEmail(email)) errors.push({ field: 'email', message: 'Valid email is required' });
    }
    if (action === 'resetPassword') {
      if (!token) errors.push({ field: 'token', message: 'Token is required' });
      if (!password || !validator.isStrongPassword(password, { minSymbols: 0 })) errors.push({ field: 'password', message: 'Password must be strong' });
    }
    req.validationErrors = errors;
    next();
  };
}

module.exports = { validateAuth };
