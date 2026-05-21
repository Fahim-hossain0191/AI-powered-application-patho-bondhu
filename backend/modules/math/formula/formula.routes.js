const express = require('express');
const router = express.Router();
const { getChapterFormulas } = require('./formula.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

/**
 * GET /api/math/chapters/:id/formulas → Formulas list
 */
router.get('/chapters/:id/formulas', authMiddleware, getChapterFormulas);

module.exports = router;
