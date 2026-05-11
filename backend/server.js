const app  = require('./app');
const env  = require('./config/env');
require('./config/db'); // DB connection test

const server = require('http').createServer(app);

server.listen(env.PORT, () => {
  console.log(`🚀 Server চলছে: http://localhost:${env.PORT}`);
  console.log(`📌 Environment: ${env.NODE_ENV}`);
});