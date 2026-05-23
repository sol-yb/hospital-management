const validator = require('validator');

function cleanInput(value) {
  if (typeof value === 'string') {
    return validator.escape(value.trim());
  }
  if (Array.isArray(value)) {
    return value.map(cleanInput);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cleanInput(val)]));
  }
  return value;
}

module.exports = { cleanInput };
