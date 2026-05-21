const db = require('../../../config/database');

/**
 * Math এর সব chapters আনো।
 * Subject ID 1 = Mathematics
 */
async function getChapters() {
  const [rows] = await db.execute(
    `SELECT chapter_id, chapter_name, chapter_number,
            total_exercise_count, display_order
     FROM chapters
     WHERE subject_id = 1 AND is_active = TRUE
     ORDER BY display_order ASC`
  );
  return rows;
}

/**
 * একটা specific chapter এর details আনো।
 */
async function getChapterById(chapter_id) {
  const [rows] = await db.execute(
    `SELECT chapter_id, chapter_name, chapter_number,
            total_exercise_count
     FROM chapters
     WHERE chapter_id = ? AND subject_id = 1`,
    [chapter_id]
  );
  return rows[0] || null;
}

module.exports = {
  getChapters,
  getChapterById,
};
