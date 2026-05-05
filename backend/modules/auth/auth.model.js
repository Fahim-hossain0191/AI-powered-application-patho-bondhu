const db = require('../../config/db');

// Email দিয়ে user খোঁজা
const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

// ID দিয়ে user খোঁজা
const findUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, name, email, class_level, gender, phone_number,
            avatar_url, total_points, streak_days, created_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

// নতুন user তৈরি
const createUser = async ({ name, email, password_hash, class_level, gender, phone_number }) => {
  const [result] = await db.query(
    `INSERT INTO users (name, email, password_hash, class_level, gender, phone_number)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, password_hash, class_level, gender || null, phone_number || null]
  );
  return result.insertId;
};

// Google OAuth — user আছে কিনা check, না থাকলে তৈরি
const findOrCreateGoogleUser = async ({ name, email, avatar_url, class_level }) => {
  let user = await findUserByEmail(email);

  if (!user) {
    const [result] = await db.query(
      `INSERT INTO users (name, email, password_hash, class_level, avatar_url, is_verified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, 'GOOGLE_AUTH', class_level || 6, avatar_url, true]
    );
    user = await findUserById(result.insertId);
  }

  return user;
};

// Refresh token save করা
const saveRefreshToken = async (userId, token) => {
  await db.query(
    `INSERT INTO refresh_tokens (user_id, token)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE token = ?, created_at = CURRENT_TIMESTAMP`,
    [userId, token, token]
  );
};

// Refresh token খোঁজা
const findRefreshToken = async (token) => {
  const [rows] = await db.query(
    'SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1',
    [token]
  );
  return rows[0] || null;
};

// Refresh token delete (logout)
const deleteRefreshToken = async (token) => {
  await db.query(
    'DELETE FROM refresh_tokens WHERE token = ?',
    [token]
  );
};

// Device track
const saveUserDevice = async (userId, deviceToken, deviceType, browser) => {
  await db.query(
    `INSERT INTO user_devices (user_id, device_token, device_type, browser)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP`,
    [userId, deviceToken, deviceType, browser]
  );
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  findOrCreateGoogleUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  saveUserDevice,
};