const db = require('../../../config/database');
const { callAI } = require('../../../utils/aiClient');

/**
 * Hint চাইলে AI Module কে call করো।
 * hint_usage table এ log করো।
 */
async function getHint(user_id, exercise_id, phase) {
  // AI Module কে call করো
  const hint = await callAI('/math/hint', { exercise_id, phase });

  // DB তে log করো
  await db.execute(
    `INSERT INTO hint_usage
     (user_id, subject_id, chapter_id, question_ref_table,
      question_ref_id, phase_reached, hint_content, question_pattern)
     VALUES (?, 1, ?, 'math_exercises', ?, ?, ?, ?)`,
    [
      user_id,
      Math.floor(exercise_id / 100) || 3, // chapter_id approximate
      exercise_id,
      phase,
      hint.hint || '',
      hint.question_pattern || '',
    ]
  );

  return hint;
}

module.exports = { getHint };
