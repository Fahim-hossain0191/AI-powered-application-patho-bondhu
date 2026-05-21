const db = require('../../../config/database');

/**
 * Chapter এর exercises আনো।
 * difficulty অনুযায়ী filter করো:
 * easy   → importance_rank = 1
 * medium → importance_rank = 2
 * hard   → importance_rank = 3
 * all    → সব
 */
async function getExercises(chapter_id, difficulty = 'all') {
  let query = `
    SELECT exercise_id, exercise_number, question_text,
           question_pattern, frequency_module, mention_count,
           display_order
    FROM math_exercises
    WHERE chapter_id = ?
  `;
  const params = [chapter_id];

  if (difficulty === 'easy') {
    query += ' AND mention_count <= 1';
  } else if (difficulty === 'medium') {
    query += ' AND mention_count = 2';
  } else if (difficulty === 'hard') {
    query += ' AND mention_count >= 3';
  }

  query += ' ORDER BY exercise_number ASC, display_order ASC';

  const [rows] = await db.execute(query, params);
  return rows;
}

/**
 * একটা exercise এর full details আনো।
 * Solution সহ।
 */
async function getExerciseById(exercise_id) {
  const [rows] = await db.execute(
    `SELECT exercise_id, exercise_number, question_text,
            question_pattern, solution_steps,
            frequency_module, mention_count
     FROM math_exercises
     WHERE exercise_id = ?`,
    [exercise_id]
  );
  return rows[0] || null;
}

module.exports = { getExercises, getExerciseById };
