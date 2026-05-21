const db = require('../../config/db');

// =============================================
// SUBJECTS
// =============================================

const getAllSubjects = async () => {
  const [rows] = await db.query(
    'SELECT * FROM subjects ORDER BY id'
  );
  return rows;
};

// =============================================
// BOOKS
// =============================================

const getBooksByClass = async (classLevel) => {
  const [rows] = await db.query(
    `SELECT b.*, s.name AS subject_name, s.slug AS subject_slug
     FROM books b
     JOIN subjects s ON b.subject_id = s.id
     WHERE b.class_level = ? AND b.is_active = 1
     ORDER BY s.id`,
    [classLevel]
  );
  return rows;
};

// একটা book এর details
const getBookById = async (bookId) => {
  const [rows] = await db.query(
    `SELECT b.*, s.name AS subject_name, s.slug AS subject_slug
     FROM books b
     JOIN subjects s ON b.subject_id = s.id
     WHERE b.id = ?`,
    [bookId]
  );
  return rows[0] || null;
};

// =============================================
// CHAPTERS
// =============================================

// Book এর সব chapters আনো
const getChaptersByBook = async (bookId) => {
  const [rows] = await db.query(
    `SELECT * FROM chapters
     WHERE book_id = ?
     ORDER BY chapter_number`,
    [bookId]
  );
  return rows;
};

// Class + Subject অনুযায়ী chapters আনো
const getChaptersBySubjectAndClass = async (subjectId, classLevel) => {
  const [rows] = await db.query(
    `SELECT c.*, b.title AS book_title
     FROM chapters c
     JOIN books b ON c.book_id = b.id
     WHERE c.subject_id = ? AND c.class_level = ?
     ORDER BY c.chapter_number`,
    [subjectId, classLevel]
  );
  return rows;
};

// একটা chapter এর details
const getChapterById = async (chapterId) => {
  const [rows] = await db.query(
    'SELECT * FROM chapters WHERE id = ?',
    [chapterId]
  );
  return rows[0] || null;
};

// =============================================
// TOPICS
// =============================================

// Chapter এর সব topics আনো
const getTopicsByChapter = async (chapterId) => {
  const [rows] = await db.query(
    `SELECT * FROM topics
     WHERE chapter_id = ?
     ORDER BY order_index`,
    [chapterId]
  );
  return rows;
};

// Subject এর সব topic types আনো (বাংলার জন্য — সৃজনশীল, দরখাস্ত etc)
const getTopicsBySubject = async (subjectId, classLevel) => {
  const [rows] = await db.query(
    `SELECT t.*, c.title AS chapter_title
     FROM topics t
     JOIN chapters c ON t.chapter_id = c.id
     WHERE t.subject_id = ? AND c.class_level = ?
     ORDER BY c.chapter_number, t.order_index`,
    [subjectId, classLevel]
  );
  return rows;
};

// =============================================
// QUESTIONS
// =============================================

// Topic এর questions আনো
const getQuestionsByTopic = async (topicId, difficulty = null) => {
  let query = `
    SELECT id, topic_id, subject_id, class_level,
           question_body, question_image_url,
           difficulty, question_type,
           is_board_question, board_year, marks
    FROM questions
    WHERE topic_id = ?
  `;
  const params = [topicId];

  if (difficulty) {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  query += ' ORDER BY is_board_question DESC, difficulty ASC';

  const [rows] = await db.query(query, params);
  return rows;
};

// একটা question এর details (hints সহ)
const getQuestionById = async (questionId) => {
  const [rows] = await db.query(
    `SELECT * FROM questions WHERE id = ?`,
    [questionId]
  );
  return rows[0] || null;
};

// Board questions আনো (class অনুযায়ী)
const getBoardQuestions = async (classLevel, subjectId = null) => {
  let query = `
    SELECT q.*, t.title AS topic_title, c.title AS chapter_title
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    JOIN chapters c ON t.chapter_id = c.id
    WHERE q.is_board_question = 1 AND q.class_level = ?
  `;
  const params = [classLevel];

  if (subjectId) {
    query += ' AND q.subject_id = ?';
    params.push(subjectId);
  }

  query += ' ORDER BY q.board_year DESC, q.subject_id';

  const [rows] = await db.query(query, params);
  return rows;
};

// Hint আনো (level অনুযায়ী)
const getHintByLevel = async (questionId, level) => {
  const hintColumn = `hint_level_${level}`;

  // Validate column name (security)
  if (!['hint_level_1', 'hint_level_2', 'hint_level_3'].includes(hintColumn)) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT ${hintColumn} AS hint FROM questions WHERE id = ?`,
    [questionId]
  );
  return rows[0]?.hint || null;
};

// =============================================
// SUBMISSIONS
// =============================================

// Submission save করো
const createSubmission = async ({
  userId, questionId, planId, scheduleId,
  userAnswer, imageUrl, hintUsedLevel, timeTakenSec
}) => {
  const [result] = await db.query(
    `INSERT INTO submissions
     (user_id, question_id, plan_id, schedule_id,
      user_answer, image_url, hint_used_level, time_taken_sec)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, questionId, planId || null, scheduleId || null,
     userAnswer || null, imageUrl || null,
     hintUsedLevel || 0, timeTakenSec || null]
  );
  return result.insertId;
};

// Submission এর details আনো
const getSubmissionById = async (submissionId) => {
  const [rows] = await db.query(
    `SELECT s.*, q.solution, q.best_solution, q.marks,
            q.question_body, q.question_type
     FROM submissions s
     JOIN questions q ON s.question_id = q.id
     WHERE s.id = ?`,
    [submissionId]
  );
  return rows[0] || null;
};

// User এর submission history
const getUserSubmissions = async (userId, subjectId = null, limit = 20) => {
  let query = `
    SELECT s.*, q.question_body, q.question_type,
           q.marks, t.title AS topic_title,
           sub.name AS subject_name
    FROM submissions s
    JOIN questions q ON s.question_id = q.id
    JOIN topics t ON q.topic_id = t.id
    JOIN subjects sub ON q.subject_id = sub.id
    WHERE s.user_id = ?
  `;
  const params = [userId];

  if (subjectId) {
    query += ' AND q.subject_id = ?';
    params.push(subjectId);
  }

  query += ' ORDER BY s.submitted_at DESC LIMIT ?';
  params.push(limit);

  const [rows] = await db.query(query, params);
  return rows;
};

// Submission এ score update করো
const updateSubmissionScore = async (submissionId, score, status) => {
  await db.query(
    `UPDATE submissions
     SET score = ?, status = ?
     WHERE id = ?`,
    [score, status, submissionId]
  );
};

// Feedback save করো
const createFeedback = async ({
  submissionId, feedbackBody, errorDetails,
  improvedVersion, alternativeSolution, stepByStep, marksBreakdown
}) => {
  const [result] = await db.query(
    `INSERT INTO submission_feedback
     (submission_id, feedback_body, error_details,
      improved_version, alternative_solution, step_by_step, marks_breakdown)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      submissionId,
      feedbackBody,
      errorDetails ? JSON.stringify(errorDetails) : null,
      improvedVersion || null,
      alternativeSolution || null,
      stepByStep || null,
      marksBreakdown ? JSON.stringify(marksBreakdown) : null
    ]
  );
  return result.insertId;
};

// Feedback আনো
const getFeedbackBySubmission = async (submissionId) => {
  const [rows] = await db.query(
    'SELECT * FROM submission_feedback WHERE submission_id = ?',
    [submissionId]
  );
  return rows[0] || null;
};

// =============================================
// USER PROGRESS UPDATE
// =============================================

const updateUserProgress = async (userId, chapterId, subjectId, isCorrect) => {
  await db.query(
    `INSERT INTO user_progress
     (user_id, chapter_id, subject_id, solved_count, correct_count, accuracy_rate, last_solved_at)
     VALUES (?, ?, ?, 1, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
       solved_count  = solved_count + 1,
       correct_count = correct_count + ?,
       accuracy_rate = ROUND((correct_count + ?) / (solved_count + 1) * 100, 1),
       last_solved_at = NOW()`,
    [userId, chapterId, subjectId,
     isCorrect ? 1 : 0,
     isCorrect ? 1 : 0,
     isCorrect ? 1 : 0,
     isCorrect ? 1 : 0]
  );
};

module.exports = {
  // Subjects
  getAllSubjects,
  // Books
  getBooksByClass, getBookById,
  // Chapters
  getChaptersByBook, getChaptersBySubjectAndClass, getChapterById,
  // Topics
  getTopicsByChapter, getTopicsBySubject,
  // Questions
  getQuestionsByTopic, getQuestionById, getBoardQuestions, getHintByLevel,
  // Submissions
  createSubmission, getSubmissionById, getUserSubmissions,
  updateSubmissionScore, createFeedback, getFeedbackBySubmission,
  // Progress
  updateUserProgress,
};