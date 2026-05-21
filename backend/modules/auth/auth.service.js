const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

/**
 * Register — নতুন user তৈরি করো
 */
async function register({ full_name, email, phone, password }) {
  // Email বা phone already আছে কিনা check করো
  const [existing] = await db.execute(
    'SELECT user_id FROM users WHERE email = ? OR phone = ?',
    [email || null, phone || null]
  );

  if (existing.length > 0) {
    throw new Error('Email বা phone number ইতোমধ্যে registered');
  }

  // Password hash করো
  const password_hash = await bcrypt.hash(password, 10);

  // DB তে insert করো
  const [result] = await db.execute(
    `INSERT INTO users (full_name, email, phone, password_hash)
     VALUES (?, ?, ?, ?)`,
    [full_name, email || null, phone || null, password_hash]
  );

  return { user_id: result.insertId, full_name, email, phone };
}

/**
 * Login — email বা phone দিয়ে login করো
 */
async function login({ email, phone, password }) {
  // User খোঁজো
  const [users] = await db.execute(
    'SELECT * FROM users WHERE email = ? OR phone = ?',
    [email || null, phone || null]
  );

  if (users.length === 0) {
    throw new Error('User পাওয়া যায়নি');
  }

  const user = users[0];

  // Password check করো
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Password সঠিক নয়');
  }

  // JWT token বানাও
  const token = jwt.sign(
    { user_id: user.user_id, full_name: user.full_name },
    process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
    },
  };
}

module.exports = { register, login };