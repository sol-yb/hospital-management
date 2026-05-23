const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

async function register(req, res, next) {
  try {
    const { user, mailInfo } = await authService.registerUser(req.body);
    const responsePayload = { user: { id: user._id, email: user.email } };
    if (mailInfo?.previewUrl) {
      responsePayload.emailPreviewUrl = mailInfo.previewUrl;
    }
    return res.status(201).json(successResponse('Registration successful. Verify your email to continue.', responsePayload));
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.authenticateUser(email, password, req.ip, req.headers['user-agent']);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(successResponse('Login successful', { accessToken, user: { id: user._id, email: user.email, role: user.role } }));
  } catch (error) {
    return next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    await authService.verifyEmail(req.params.token);
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect('/login?verified=1');
    }
    return res.status(200).json(successResponse('Email verified successfully'));
  } catch (error) {
    return next(error);
  }
}

async function requestPasswordReset(req, res, next) {
  try {
    await authService.requestPasswordReset(req.body.email);
    return res.status(200).json(successResponse('Password reset email sent')); 
  } catch (error) {
    return next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    return res.status(200).json(successResponse('Password reset completed')); 
  } catch (error) {
    return next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const data = await authService.refreshAccessToken(refreshToken);
    return res.status(200).json(successResponse('Token refreshed', data));
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    await authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.status(200).json(successResponse('Logged out successfully'));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  logout,
};
