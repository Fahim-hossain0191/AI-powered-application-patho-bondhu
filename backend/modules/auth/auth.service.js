const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

async function register({ full_name, email, phone, password }) {
  const [existing] = await db.execute(
    'SELECT user_id FROM users WHERE email = ? OR phone = ? LIMIT 1',
    [email || null, phone || null]
  );

  if (existing.length > 0) {
    throw new Error('Email বা phone number ইতোমধ্যে registered');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const [result] = await db.execute(
    `INSERT INTO users (full_name, email, phone, password_hash)
     VALUES (?, ?, ?, ?)`,
    [full_name, email || null, phone || null, password_hash]
  );

  return {
    user_id: result.insertId,
    full_name,
    email: email || null,
    phone: phone || null,
  };
}

async function login({ email, phone, password }) {
  const [users] = await db.execute(
    'SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1',
    [email || null, phone || null]
  );

  if (users.length === 0) {
    throw new Error('User পাওয়া যায়নি');
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('Password সঠিক নয়');
  }

  const token = jwt.sign(
    {
      id: user.user_id,
      user_id: user.user_id,
      full_name: user.full_name,
    },
    process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      class: user.class,
      school_name: user.school_name,
      board_name: user.board_name,
      profile_image_url: user.profile_image_url,
    },
  };
}

module.exports = { register, login };
