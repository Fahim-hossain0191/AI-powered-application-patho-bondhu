require('dotenv').config();

module.exports = {
  PORT:                   process.env.PORT || 5000,
  NODE_ENV:               process.env.NODE_ENV || 'development',

  DB_HOST:                process.env.DB_HOST,
  DB_USER:                process.env.DB_USER,
  DB_PASSWORD:            process.env.DB_PASSWORD,
  DB_NAME:                process.env.DB_NAME,
  DB_PORT:                process.env.DB_PORT || 3306,

  JWT_ACCESS_SECRET:      process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET:     process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES:     process.env.JWT_ACCESS_EXPIRES  || '15m',
  JWT_REFRESH_EXPIRES:    process.env.JWT_REFRESH_EXPIRES || '7d',

  GOOGLE_CLIENT_ID:       process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET:   process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL:    process.env.GOOGLE_CALLBACK_URL,

  FRONTEND_URL:           process.env.FRONTEND_URL || 'http://localhost:3000',
};