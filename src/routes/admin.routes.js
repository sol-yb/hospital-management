const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();
router.use(authenticate);
router.get('/dashboard', authorize(['super-admin']), adminController.getDashboardStats);

module.exports = router;
