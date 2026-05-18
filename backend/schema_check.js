const mysql = require('mysql2/promise');
const env = require('./config/env');

async function checkSchema() {
  const pool = mysql.createPool({
    host:     env.DB_HOST,
    user:     env.DB_USER,
    database: env.DB_NAME,
    port:     env.DB_PORT,
  });

  try {
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    console.log('Tables:', tableNames);

    for (const table of tableNames) {
      const [desc] = await pool.query(`DESCRIBE ${table}`);
      console.log(`\nSchema for ${table}:`);
      console.table(desc);
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkSchema();
