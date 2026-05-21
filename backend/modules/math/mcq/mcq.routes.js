const express = require('express');
const router = express.Router();
const { generateMCQController, submitMCQController } = require('./mcq.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

/**
 * POST /api/math/chapters/:id/mcq/generate → MCQ generate
 * POST /api/math/mcq/submit                → Answer submit
 */
router.post('/chapters/:id/mcq/generate', authMiddleware, generateMCQController);
router.post('/mcq/submit', authMiddleware, submitMCQController);

module.exports = router;
