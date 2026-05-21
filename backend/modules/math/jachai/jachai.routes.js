const express = require('express');
const router = express.Router();
const {
  exerciseCheckTextController,
  exerciseCheckImageController,
  solveController,
  checkController,
  imageController,
} = require('./jachai.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

/**
 * POST /api/math/jachai/exercise-check-text  → Exercise text answer check
 * POST /api/math/jachai/exercise-check-image → Exercise image answer check
 * POST /api/math/jachai/solve                → যেকোনো প্রশ্ন solve
 * POST /api/math/jachai/check                → নিজের solution check
 * POST /api/math/jachai/image                → ছবি দিলে AI বুঝবে
 */
router.post('/exercise-check-text', authMiddleware, exerciseCheckTextController);
router.post('/exercise-check-image', authMiddleware, exerciseCheckImageController);
router.post('/solve', authMiddleware, solveController);
router.post('/check', authMiddleware, checkController);
router.post('/image', authMiddleware, imageController);

module.exports = router;
