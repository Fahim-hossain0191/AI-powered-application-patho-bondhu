const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

/**
 * JWT token verify করে।
 * Protected routes এ এই middleware লাগবে।
 * Token valid হলে req.user এ user info set করবে।
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authorization token missing', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};

module.exports = authMiddleware;
module.exports.protect = authMiddleware;
