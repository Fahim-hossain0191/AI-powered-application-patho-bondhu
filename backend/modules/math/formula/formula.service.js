const db = require('../../../config/database');

/**
 * Chapter এর Formulas আনো
 */
async function getFormulasByChapterId(chapter_id) {
  const [rows] = await db.execute(
    `SELECT formula_id, chapter_id, formula_text, when_to_use,
            variables_explanation, importance_rank, source, display_order
     FROM math_formulas
     WHERE chapter_id = ?
     ORDER BY display_order ASC`,
    [chapter_id]
  );
  return rows;
}

module.exports = { getFormulasByChapterId };
