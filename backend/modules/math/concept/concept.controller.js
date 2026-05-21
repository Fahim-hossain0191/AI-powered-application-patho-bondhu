const { getConceptsByChapterId } = require('./concept.service');
const { success, error } = require('../../../utils/response');

/**
 * GET /api/math/chapters/:id/concepts
 */
async function getChapterConcepts(req, res) {
  try {
    const { id } = req.params;
    const concepts = await getConceptsByChapterId(id);
    return success(res, concepts);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getChapterConcepts };
