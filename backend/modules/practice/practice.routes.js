const express  = require('express');
const ctrl     = require('./practice.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

// সব routes এ login লাগবে
router.use(protect);

// Subjects
router.get('/subjects', ctrl.getSubjects);

// Books
router.get('/books',                          ctrl.getBooks);
router.get('/books/:bookId/chapters',         ctrl.getChaptersByBook);

// Chapters by subject
router.get('/subjects/:subjectId/chapters',   ctrl.getChaptersBySubject);

// Topics
router.get('/chapters/:chapterId/topics',     ctrl.getTopicsByChapter);
router.get('/subjects/:subjectId/topics',     ctrl.getTopicsBySubject);

// Questions
router.get('/questions',                      ctrl.getQuestions);
router.get('/questions/:questionId',          ctrl.getQuestion);
router.get('/board-questions',                ctrl.getBoardQuestions);

// Hints
router.get('/hint',                           ctrl.getHint);

// Submissions
router.post('/submit',                        ctrl.submitAnswer);
router.get('/submissions/:submissionId',      ctrl.getSubmission);
router.get('/history',                        ctrl.getHistory);

module.exports = router;