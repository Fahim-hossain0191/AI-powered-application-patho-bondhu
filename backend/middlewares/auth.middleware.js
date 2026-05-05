const jwtUtils = require('../utils/jwt.utils');
const { sendError } = require('../utils/response.utils');

const protect = (req, res, next) => {
  try {
    // Header থেকে token নাও
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Login করো', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtUtils.verifyAccessToken(token);

    // Request এ user info যোগ করো
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Token মেয়াদ শেষ বা ভুল, আবার login করো', 401);
  }
};

module.exports = { protect };