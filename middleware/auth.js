const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Nok' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: ' refuse' });
      }
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Token non ok' });
    }
  };
};

module.exports = auth;
