function successResponse(message, data = {}) {
  return { message, data };
}

function errorResponse(message, status = 400) {
  return { error: message, status };
}

module.exports = { successResponse, errorResponse };
