const express = require('express');
const router = express.Router();
const { getChapterConcepts } = require('./concept.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

/**
 * GET /api/math/chapters/:id/concepts → Concepts list
 */
router.get('/chapters/:id/concepts', authMiddleware, getChapterConcepts);

module.exports = router;
