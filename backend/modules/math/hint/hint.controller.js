const { getHint } = require('./hint.service');
const { success, error } = require('../../../utils/response');

/**
 * POST /api/math/hint
 *
 * Frontend থেকে আসবে:
 * { exercise_id: 5, phase: 1 }
 *
 * Frontend এ call করবে:
 * fetch('http://localhost:5000/api/math/hint', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     Authorization: `Bearer ${token}`
 *   },
 *   body: JSON.stringify({ exercise_id: 5, phase: 1 })
 * })
 *
 * Frontend পাবে:
 * {
 *   phase: 1,
 *   hint: "...",
 *   encouragement: "...",
 *   has_more_hints: true
 * }
 */
async function hintController(req, res) {
  try {
    const { exercise_id, phase } = req.body;
    const user_id = req.user.user_id;

    if (!exercise_id || !phase) {
      return error(res, 'exercise_id এবং phase দিতে হবে', 400);
    }

    if (phase < 1 || phase > 5) {
      return error(res, 'Phase অবশ্যই 1 থেকে 5 এর মধ্যে হতে হবে', 400);
    }

    const hint = await getHint(user_id, exercise_id, phase);
    return success(res, hint);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { hintController };
