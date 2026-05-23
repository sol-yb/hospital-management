const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateAuth } = require('../validators/auth.validator');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post('/register', validateAuth('register'), validateRequest, authController.register);
router.post('/login', validateAuth('login'), validateRequest, authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', validateAuth('forgotPassword'), validateRequest, authController.requestPasswordReset);
router.post('/reset-password', validateAuth('resetPassword'), validateRequest, authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
