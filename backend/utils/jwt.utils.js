const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Access Token — 15 min
const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  });
};

// Refresh Token — 7 day
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};