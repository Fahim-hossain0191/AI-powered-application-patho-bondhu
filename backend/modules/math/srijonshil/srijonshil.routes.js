const express = require('express');
const router = express.Router();
const { getChapterSrijonshil } = require('./srijonshil.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

/**
 * GET /api/math/chapters/:id/srijonshil → Srijonshil list
 */
router.get('/chapters/:id/srijonshil', authMiddleware, getChapterSrijonshil);

module.exports = router;
