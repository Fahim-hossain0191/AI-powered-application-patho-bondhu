const env = require('./env');

module.exports = {
  origin: env.FRONTEND_URL,
  credentials: true,           // Cookie 
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};