const { getFormulasByChapterId } = require('./formula.service');
const { success, error } = require('../../../utils/response');

/**
 * GET /api/math/chapters/:id/formulas
 */
async function getChapterFormulas(req, res) {
  try {
    const { id } = req.params;
    const formulas = await getFormulasByChapterId(id);
    return success(res, formulas);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getChapterFormulas };
