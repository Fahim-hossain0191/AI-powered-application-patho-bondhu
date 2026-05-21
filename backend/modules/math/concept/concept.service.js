const db = require('../../../config/database');

/**
 * Chapter এর Concepts আনো
 */
async function getConceptsByChapterId(chapter_id) {
  const [rows] = await db.execute(
    `SELECT concept_id, chapter_id, module_title, content,
            examples, importance_rank, source, display_order
     FROM math_concepts
     WHERE chapter_id = ?
     ORDER BY display_order ASC`,
    [chapter_id]
  );
  return rows;
}

module.exports = { getConceptsByChapterId };
