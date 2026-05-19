const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const mathController = require('./math.controller');

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

module.exports = router;
