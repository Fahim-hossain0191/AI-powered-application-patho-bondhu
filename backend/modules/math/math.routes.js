const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const mathController = require('./math.controller');
const { getAllChapters, getChapter } = require('./chapter/chapter.controller');
const { getChapterConcepts } = require('./concept/concept.controller');
const { getChapterFormulas } = require('./formula/formula.controller');
const { getChapterSrijonshil } = require('./srijonshil/srijonshil.controller');

const router = express.Router();

// Ensure all routes are protected so user info is available
router.use(protect);

router.post('/mcq/generate', mathController.mcqGenerate);
router.post('/answer/check-text', mathController.answerCheckText);
router.post('/answer/check-image', mathController.answerCheckImage);
router.post('/hint', mathController.getHint);
router.post('/jachai/solve', mathController.jachaiSolve);
router.post('/jachai/check', mathController.jachaiCheck);
router.post('/jachai/image', mathController.jachaiImage);
router.get('/exercises', mathController.getExercises);

// Chapter & Content Routes
router.get('/chapters', getAllChapters);
router.get('/chapters/:id', getChapter);
router.get('/chapters/:id/concepts', getChapterConcepts);
router.get('/chapters/:id/formulas', getChapterFormulas);
router.get('/chapters/:id/srijonshil', getChapterSrijonshil);

module.exports = router;

