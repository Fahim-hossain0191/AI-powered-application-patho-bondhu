const mysql = require('mysql2/promise');
const env = require('./config/env');

async function createTables() {
  const pool = mysql.createPool({
    host:     env.DB_HOST,
    user:     env.DB_USER,
    database: env.DB_NAME,
    port:     env.DB_PORT,
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        token VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log('Created refresh_tokens table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_devices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        device_token VARCHAR(255) NOT NULL UNIQUE,
        device_type VARCHAR(50),
        browser VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log('Created user_devices table');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

createTables();
