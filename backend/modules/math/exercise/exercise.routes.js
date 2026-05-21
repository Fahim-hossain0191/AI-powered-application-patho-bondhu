const express = require('express');
const router = express.Router();
const { getAllExercises, getExerciseSolution } = require('./exercise.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

/**
 * GET /api/math/chapters/:id/exercises?difficulty=easy
 * GET /api/math/exercises/:exercise_id/solution
 */
router.get('/chapters/:id/exercises', authMiddleware, getAllExercises);
router.get('/exercises/:exercise_id/solution', authMiddleware, getExerciseSolution);

module.exports = router;
