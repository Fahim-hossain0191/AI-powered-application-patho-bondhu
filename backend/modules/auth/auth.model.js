const db = require('../../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
  );
  return rows[0] || null;
};

const findUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, name, email, class_level, gender, phone_number,
            medium, avatar_url, total_points, streak_days, created_at
     FROM users WHERE id = ? LIMIT 1`, [id]
  );
  return rows[0] || null;
};

const createUser = async ({ name, email, password_hash, class_level, gender, phone_number, medium }) => {
  const [result] = await db.query(
    `INSERT INTO users 
     (name, email, password_hash, class_level, gender, phone_number, medium)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password_hash, class_level, gender || null, phone_number || null, medium || null]
  );
  return result.insertId;
};

// Registration এর পর hobbies save করা
const saveUserHobbies = async (userId, hobbyIds) => {
  if (!hobbyIds || hobbyIds.length === 0) return;
  const values = hobbyIds.map(id => [userId, id]);
  await db.query(
    'INSERT IGNORE INTO user_hobbies (user_id, hobby_slug) VALUES ?',
    [values]
  );
};

// Registration এর পর favourite subjects save করা
const saveUserFavSubjects = async (userId, subjectIds) => {
  if (!subjectIds || subjectIds.length === 0) return;
  const values = subjectIds.map(id => [userId, id]);
  await db.query(
    'INSERT IGNORE INTO user_favourite_subjects (user_id, subject_slug) VALUES ?',
    [values]
  );
};

// Learning style save করা
const saveUserLearnStyles = async (userId, styles) => {
  if (!styles || styles.length === 0) return;
  const values = styles.map(s => [userId, s]);
  await db.query(
    'INSERT IGNORE INTO user_learning_styles (user_id, style) VALUES ?',
    [values]
  );
};

const saveRefreshToken = async (userId, token) => {
  await db.query(
    `INSERT INTO refresh_tokens (user_id, token)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE token = ?, created_at = CURRENT_TIMESTAMP`,
    [userId, token, token]
  );
};

const findRefreshToken = async (token) => {
  const [rows] = await db.query(
    'SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1', [token]
  );
  return rows[0] || null;
};

const deleteRefreshToken = async (token) => {
  await db.query('DELETE FROM refresh_tokens WHERE token = ?', [token]);
};

const saveUserDevice = async (userId, deviceToken, deviceType, browser) => {
  await db.query(
    `INSERT INTO user_devices (user_id, device_token, device_type, browser)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP`,
    [userId, deviceToken, deviceType, browser]
  );
};

const findOrCreateGoogleUser = async ({ name, email, avatar_url }) => {
  let user = await findUserByEmail(email);
  if (!user) {
    const [result] = await db.query(
      `INSERT INTO users (name, email, password_hash, class_level, avatar_url, is_verified)
       VALUES (?, ?, 'GOOGLE_AUTH', 6, ?, true)`,
      [name, email, avatar_url]
    );
    user = await findUserById(result.insertId);
  }
  return user;
};

module.exports = {
  findUserByEmail, findUserById, createUser,
  saveUserHobbies, saveUserFavSubjects, saveUserLearnStyles,
  saveRefreshToken, findRefreshToken, deleteRefreshToken,
  saveUserDevice, findOrCreateGoogleUser,
};