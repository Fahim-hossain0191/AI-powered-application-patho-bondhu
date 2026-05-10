const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host:     env.DB_HOST,
  user:     env.DB_USER,
  database: env.DB_NAME,
  port:     env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

// Connection test
pool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  });

module.exports = pool;