const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../services/dashboard.service');

router.get('/login', (req, res) => res.render('auth/login'));
router.get('/register', (req, res) => res.render('auth/register'));
router.get('/admin', async (req, res, next) => {
  try {
    const dashboard = await getDashboardStats();
    res.render('dashboard/admin', { dashboard });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
