const express = require('express');
const router = express.Router();
const {
  getAllChapters,
  getChapter,
} = require('./chapter.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

/**
 * GET /api/math/chapters             → সব chapters
 * GET /api/math/chapters/:id         → একটা chapter
 */
router.get('/chapters', authMiddleware, getAllChapters);
router.get('/chapters/:id', authMiddleware, getChapter);

module.exports = router;
