const db = require('../../../config/database');

/**
 * Chapter এর Srijonshil (Creative questions) আনো
 */
async function getSrijonshilByChapterId(chapter_id) {
  const [rows] = await db.execute(
    `SELECT srijonshil_id, chapter_id, category, uddipok_text,
            question_text, solution, board_id, exam_year,
            source_name, source_type, display_order
     FROM math_srijonshil
     WHERE chapter_id = ?
     ORDER BY display_order ASC`,
    [chapter_id]
  );
  return rows;
}

module.exports = { getSrijonshilByChapterId };
