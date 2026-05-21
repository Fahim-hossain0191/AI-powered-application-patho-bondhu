const {
  getChapters,
  getChapterById,
} = require('./chapter.service');
const { success, error } = require('../../../utils/response');

/**
 * GET /api/math/chapters
 * Frontend পাবে: সব chapters এর list
 */
async function getAllChapters(req, res) {
  try {
    const chapters = await getChapters();
    return success(res, chapters);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * GET /api/math/chapters/:id
 * Frontend পাবে: একটা chapter এর details
 */
async function getChapter(req, res) {
  try {
    const { id } = req.params;
    const chapter = await getChapterById(id);

    if (!chapter) {
      return error(res, 'Chapter পাওয়া যায়নি', 404);
    }

    return success(res, chapter);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getAllChapters,
  getChapter,
};
