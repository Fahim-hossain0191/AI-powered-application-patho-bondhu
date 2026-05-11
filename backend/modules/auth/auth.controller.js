const authService = require('./auth.service');
const { registerSchema, loginSchema } = require('./auth.validator');
const { sendSuccess, sendError } = require('../../utils/response.utils');

// Cookie options
const refreshCookieOptions = {
  httpOnly: true,        // accessable only by server
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // ৭ day
};

const register = async (req, res) => {
  try {
    // Validation
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { user, accessToken, refreshToken } = await authService.register(value);

    // Refresh token saved in cookie
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    return sendSuccess(res, { user, accessToken }, 'Registration সফল হয়েছে', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const deviceType = req.headers['x-device-type'] || 'desktop';
    const browser    = req.headers['user-agent'] || 'unknown';

    const { user, accessToken, refreshToken, deviceToken } =
      await authService.login({ ...value, deviceType, browser });

    // Refresh token saved in cookie
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    // Device token saved in cookie (landing page এর জন্য)
    res.cookie('deviceToken', deviceToken, {
      httpOnly: false,   // Frontend JS পড়তে পারবে
      maxAge: 365 * 24 * 60 * 60 * 1000,  // ১ বছর
    });

    return sendSuccess(res, { user, accessToken }, 'Login সফল হয়েছে');
  } catch (err) {
    return sendError(res, err.message, 401);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return sendError(res, 'Refresh token নেই', 401);
    }

    const { accessToken } = await authService.refreshAccessToken(token);
    return sendSuccess(res, { accessToken }, 'Token refresh হয়েছে');
  } catch (err) {
    return sendError(res, 'Invalid বা মেয়াদ উত্তীর্ণ token', 401);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await authService.logout(token);
    }

    // Cookie clear করো
    res.clearCookie('refreshToken');
    res.clearCookie('deviceToken');

    return sendSuccess(res, null, 'Logout সফল হয়েছে');
  } catch (err) {
    return sendError(res, err.message);
  }
};

const googleCallback = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.handleGoogleAuth(req.user);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    // Frontend এ redirect করো access token সহ
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${accessToken}`
    );
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/error`);
  }
};

module.exports = { register, login, refreshToken, logout, googleCallback };