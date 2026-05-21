const { register, login } = require('./auth.service');
const { success, error } = require('../../utils/response');

/**
 * POST /api/auth/register
 * Frontend থেকে আসবে: { full_name, email, phone, password }
 */
async function registerController(req, res) {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !password) {
      return error(res, 'নাম এবং password দিতে হবে', 400);
    }

    if (!email && !phone) {
      return error(res, 'Email অথবা phone number দিতে হবে', 400);
    }

    const user = await register({ full_name, email, phone, password });
    return success(res, user, 'Registration সফল হয়েছে', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
}

/**
 * POST /api/auth/login
 * Frontend থেকে আসবে: { email, phone, password }
 * Frontend পাবে: { token, user }
 */
async function loginController(req, res) {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return error(res, 'Email/Phone এবং password দিতে হবে', 400);
    }

    const result = await login({ email, phone, password });
    return success(res, result, 'Login সফল হয়েছে');
  } catch (err) {
    return error(res, err.message, 401);
  }
}

module.exports = { registerController, loginController };