const practiceService = require('./practice.service');
const {
  getQuestionsSchema,
  getHintSchema,
  submitAnswerSchema,
  getBoardQuestionsSchema,
} = require('./practice.validator');
const { sendSuccess, sendError } = require('../../utils/response.utils');

// GET /api/practice/subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await practiceService.getSubjects();
    return sendSuccess(res, subjects, 'Subjects পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message);
  }
};

// GET /api/practice/books?class=8
const getBooks = async (req, res) => {
  try {
    const classLevel = parseInt(req.query.class) || req.user.class_level;
    const books = await practiceService.getBooksByClass(classLevel);
    return sendSuccess(res, books, 'Books পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

// GET /api/practice/books/:bookId/chapters
const getChaptersByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const data = await practiceService.getChaptersByBook(bookId);
    return sendSuccess(res, data, 'Chapters পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

// GET /api/practice/subjects/:subjectId/chapters?class=8
const getChaptersBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const classLevel = parseInt(req.query.class) || req.user.class_level;
    const chapters = await practiceService.getChaptersBySubjectAndClass(subjectId, classLevel);
    return sendSuccess(res, chapters, 'Chapters পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message);
  }
};

// GET /api/practice/chapters/:chapterId/topics
const getTopicsByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const data = await practiceService.getTopicsByChapter(chapterId);
    return sendSuccess(res, data, 'Topics পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

// GET /api/practice/subjects/:subjectId/topics?class=8
const getTopicsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const classLevel = parseInt(req.query.class) || req.user.class_level;
    const topics = await practiceService.getTopicsBySubject(subjectId, classLevel);
    return sendSuccess(res, topics, 'Topics পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message);
  }
};

// GET /api/practice/questions?topic_id=1&difficulty=easy
const getQuestions = async (req, res) => {
  try {
    const { error, value } = getQuestionsSchema.validate(req.query);
    if (error) return sendError(res, error.details[0].message, 400);

    const questions = await practiceService.getQuestionsByTopic(
      value.topic_id,
      value.difficulty
    );
    return sendSuccess(res, questions, 'Questions পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

// GET /api/practice/questions/:questionId
const getQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await practiceService.getQuestionById(questionId);
    return sendSuccess(res, question, 'Question পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

// GET /api/practice/board-questions?subject_id=1
const getBoardQuestions = async (req, res) => {
  try {
    const { error, value } = getBoardQuestionsSchema.validate(req.query);
    if (error) return sendError(res, error.details[0].message, 400);

    const classLevel = req.user.class_level;
    const questions = await practiceService.getBoardQuestions(
      classLevel,
      value.subject_id
    );
    return sendSuccess(res, questions, 'Board questions পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message);
  }
};

// GET /api/practice/hint?question_id=1&level=1
const getHint = async (req, res) => {
  try {
    const { error, value } = getHintSchema.validate(req.query);
    if (error) return sendError(res, error.details[0].message, 400);

    const hint = await practiceService.getHint(
      value.question_id,
      value.level,
      req.user.id
    );
    return sendSuccess(res, hint, 'Hint পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

// POST /api/practice/submit
const submitAnswer = async (req, res) => {
  try {
    const { error, value } = submitAnswerSchema.validate(req.body);
    if (error) return sendError(res, error.details[0].message, 400);

    const result = await practiceService.submitAnswer({
      userId:         req.user.id,
      questionId:     value.question_id,
      userAnswer:     value.user_answer,
      imageUrl:       value.image_url,
      hintUsedLevel:  value.hint_used_level,
      timeTakenSec:   value.time_taken_sec,
      planId:         value.plan_id,
      scheduleId:     value.schedule_id,
    });

    return sendSuccess(res, result, 'উত্তর জমা হয়েছে', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

// GET /api/practice/submissions/:submissionId
const getSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const data = await practiceService.getSubmissionDetails(
      submissionId,
      req.user.id
    );
    return sendSuccess(res, data, 'Submission পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

// GET /api/practice/history?subject_id=1&limit=20
const getHistory = async (req, res) => {
  try {
    const subjectId = req.query.subject_id || null;
    const limit     = parseInt(req.query.limit) || 20;
    const history   = await practiceService.getUserHistory(
      req.user.id,
      subjectId,
      limit
    );
    return sendSuccess(res, history, 'History পাওয়া গেছে');
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = {
  getSubjects,
  getBooks,
  getChaptersByBook,
  getChaptersBySubject,
  getTopicsByChapter,
  getTopicsBySubject,
  getQuestions,
  getQuestion,
  getBoardQuestions,
  getHint,
  submitAnswer,
  getSubmission,
  getHistory,
};