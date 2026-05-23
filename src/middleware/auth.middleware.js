const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid token user' });
    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };
