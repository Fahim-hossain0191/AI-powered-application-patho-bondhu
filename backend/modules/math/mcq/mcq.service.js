const db = require('../../../config/database');
const { callAI } = require('../../../utils/aiClient');

/**
 * MCQ generate করো।
 * AI Module কে call করো।
 * Session DB তে save করো।
 */
async function generateMCQ(user_id, chapter_id, count = 20) {
  // AI Module কে call করো
  const result = await callAI('/math/mcq/generate', {
    chapter_id,
    count,
    previously_generated: [],
  });

  // MCQ session DB তে save করো
  const [session] = await db.execute(
    `INSERT INTO mcq_sessions
     (user_id, subject_id, chapter_id, session_type, total_questions)
     VALUES (?, 1, ?, 'practice', ?)`,
    [user_id, chapter_id, result.count]
  );

  return {
    session_id: session.insertId,
    ...result,
  };
}

/**
 * MCQ answer submit করো।
 * Correct কিনা check করো।
 * mcq_answers table এ save করো।
 */
async function submitMCQAnswer(session_id, mcq_data, selected_option) {
  const is_correct = selected_option === mcq_data.correct;

  await db.execute(
    `INSERT INTO mcq_answers
     (session_id, mcq_ref_table, mcq_ref_id, selected_option, is_correct)
     VALUES (?, 'generated', 0, ?, ?)`,
    [session_id, selected_option, is_correct]
  );

  return {
    is_correct,
    correct_option: mcq_data.correct,
    explanation: mcq_data.explanation,
  };
}

module.exports = { generateMCQ, submitMCQAnswer };
