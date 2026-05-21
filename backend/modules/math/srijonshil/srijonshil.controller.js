const { getSrijonshilByChapterId } = require('./srijonshil.service');
const { success, error } = require('../../../utils/response');

/**
 * GET /api/math/chapters/:id/srijonshil
 */
async function getChapterSrijonshil(req, res) {
  try {
    const { id } = req.params;
    const srijonshil = await getSrijonshilByChapterId(id);
    return success(res, srijonshil);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getChapterSrijonshil };
