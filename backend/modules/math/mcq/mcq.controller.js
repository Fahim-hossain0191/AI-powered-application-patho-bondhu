const { generateMCQ, submitMCQAnswer } = require('./mcq.service');
const { success, error } = require('../../../utils/response');

/**
 * POST /api/math/chapters/:id/mcq/generate
 *
 * Frontend এ call করবে:
 * fetch('http://localhost:5000/api/math/chapters/3/mcq/generate', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     Authorization: `Bearer ${token}`
 *   }
 * })
 *
 * Frontend পাবে:
 * {
 *   session_id: 1,
 *   chapter_name: "বীজগাণিতিক রাশি",
 *   count: 20,
 *   mcqs: [ { question, options, correct, explanation } ]
 * }
 */
async function generateMCQController(req, res) {
  try {
    const { id: chapter_id } = req.params;
    const user_id = req.user.user_id;

    const result = await generateMCQ(user_id, chapter_id);
    return success(res, result, 'MCQ generate হয়েছে');
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * POST /api/math/mcq/submit
 *
 * Frontend থেকে আসবে:
 * { session_id, mcq_data, selected_option }
 *
 * Frontend পাবে:
 * { is_correct, correct_option, explanation }
 */
async function submitMCQController(req, res) {
  try {
    const { session_id, mcq_data, selected_option } = req.body;

    if (!session_id || !mcq_data || !selected_option) {
      return error(res, 'সব field দিতে হবে', 400);
    }

    const result = await submitMCQAnswer(session_id, mcq_data, selected_option);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { generateMCQController, submitMCQController };
