const db = require('../../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
  );
  if (rows[0]) {
    rows[0].id = rows[0].user_id;
  }
  return rows[0] || null;
};

const findUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT user_id as id, full_name, email, class, phone,
            school_name, board_name, profile_image_url, created_at
     FROM users WHERE user_id = ? LIMIT 1`, [id]
  );
  return rows[0] || null;
};

const createUser = async (userData) => {
  const { full_name, email, password_hash, class: user_class, phone, school_name, board_name, profile_image_url } = userData;
  const [result] = await db.query(
    `INSERT INTO users 
     (full_name, email, password_hash, class, phone, school_name, board_name, profile_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, password_hash, user_class, phone || null, school_name || null, board_name || null, profile_image_url || null]
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
      `INSERT INTO users (full_name, email, password_hash, class, profile_image_url)
       VALUES (?, ?, 'GOOGLE_AUTH', '9-10', ?)`,
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