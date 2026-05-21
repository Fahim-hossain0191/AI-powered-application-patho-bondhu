const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

<<<<<<< HEAD
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
=======
const register = async (userData) => {
  const { full_name, email, password, class: user_class, phone, school_name, board_name, profile_image_url } = userData;
  // Email already আছে কিনা check
  const existing = await authModel.findUserByEmail(email);
  if (existing) {
    throw new Error('এই email দিয়ে আগেই account খোলা হয়েছে');
>>>>>>> origin/main
  }

  // Password hash করো
  const password_hash = await bcrypt.hash(password, 10);

<<<<<<< HEAD
  // DB তে insert করো
  const [result] = await db.execute(
    `INSERT INTO users (full_name, email, phone, password_hash)
     VALUES (?, ?, ?, ?)`,
    [full_name, email || null, phone || null, password_hash]
  );
=======
  // User তৈরি করো
  const userId = await authModel.createUser({
    full_name, email, password_hash, class: user_class, phone, school_name, board_name, profile_image_url
  });

  // Tokens তৈরি করো
  const payload = { id: userId, email };
  const accessToken  = jwtUtils.generateAccessToken(payload);
  const refreshToken = jwtUtils.generateRefreshToken(payload);
>>>>>>> origin/main

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