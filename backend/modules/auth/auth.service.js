const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const authModel = require('./auth.model');
const jwtUtils = require('../../utils/jwt.utils');

const register = async ({ name, email, password, class_level, gender, phone_number }) => {
  // Email already আছে কিনা check
  const existing = await authModel.findUserByEmail(email);
  if (existing) {
    throw new Error('এই email দিয়ে আগেই account খোলা হয়েছে');
  }

  // Password hash করো
  const password_hash = await bcrypt.hash(password, 12);

  // User তৈরি করো
  const userId = await authModel.createUser({
    name, email, password_hash, class_level, gender, phone_number,
  });
  await Promise.all([
    authModel.saveUserHobbies(userId, hobbies),
    authModel.saveUserFavSubjects(userId, favourite_subjects),
    authModel.saveUserLearnStyles(userId, learning_styles),
  ]);
  // Tokens তৈরি করো
  const payload = { id: userId, email };
  const accessToken  = jwtUtils.generateAccessToken(payload);
  const refreshToken = jwtUtils.generateRefreshToken(payload);

  // Refresh token save করো
  await authModel.saveRefreshToken(userId, refreshToken);

  const user = await authModel.findUserById(userId);
  return { user, accessToken, refreshToken };
};

const login = async ({ email, password, deviceType, browser }) => {
  // User খোঁজো
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Email বা password ভুল');
  }

  // Google এ register করা user email/password দিয়ে login করতে পারবে না
  if (user.password_hash === 'GOOGLE_AUTH') {
    throw new Error('এই account টি Google দিয়ে তৈরি। Google দিয়ে login করো।');
  }

  // Password check করো
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Email বা password ভুল');
  }

  // Tokens তৈরি করো
  const payload = { id: user.id, email: user.email };
  const accessToken  = jwtUtils.generateAccessToken(payload);
  const refreshToken = jwtUtils.generateRefreshToken(payload);

  // Refresh token save করো
  await authModel.saveRefreshToken(user.id, refreshToken);

  // Device track করো
  const deviceToken = uuidv4();
  await authModel.saveUserDevice(user.id, deviceToken, deviceType || 'desktop', browser || 'unknown');

  // Password বাদ দিয়ে user data পাঠাও
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken, deviceToken };
};

const refreshAccessToken = async (refreshToken) => {
  // Token verify করো
  const decoded = jwtUtils.verifyRefreshToken(refreshToken);

  // Database এ আছে কিনা check করো
  const stored = await authModel.findRefreshToken(refreshToken);
  if (!stored) {
    throw new Error('Invalid refresh token');
  }

  // নতুন access token দাও
  const accessToken = jwtUtils.generateAccessToken({
    id: decoded.id,
    email: decoded.email,
  });

  return { accessToken };
};

const logout = async (refreshToken) => {
  await authModel.deleteRefreshToken(refreshToken);
};

const handleGoogleAuth = async (googleUser) => {
  const user = await authModel.findOrCreateGoogleUser(googleUser);

  const payload = { id: user.id, email: user.email };
  const accessToken  = jwtUtils.generateAccessToken(payload);
  const refreshToken = jwtUtils.generateRefreshToken(payload);

  await authModel.saveRefreshToken(user.id, refreshToken);

  return { user, accessToken, refreshToken };
};

module.exports = { register, login, refreshAccessToken, logout, handleGoogleAuth };