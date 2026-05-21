const practiceModel = require('./practice.model');

// =============================================
// SUBJECTS
// =============================================

const getSubjects = async () => {
  return await practiceModel.getAllSubjects();
};

// =============================================
// BOOKS
// =============================================

const getBooksByClass = async (classLevel) => {
  if (!classLevel || classLevel < 6 || classLevel > 10) {
    throw new Error('Class level ৬ থেকে ১০ এর মধ্যে হতে হবে');
  }
  return await practiceModel.getBooksByClass(classLevel);
};

// =============================================
// CHAPTERS
// =============================================

const getChaptersByBook = async (bookId) => {
  const book = await practiceModel.getBookById(bookId);
  if (!book) throw new Error('Book পাওয়া যায়নি');
  const chapters = await practiceModel.getChaptersByBook(bookId);
  return { book, chapters };
};

const getChaptersBySubjectAndClass = async (subjectId, classLevel) => {
  return await practiceModel.getChaptersBySubjectAndClass(subjectId, classLevel);
};

// =============================================
// TOPICS
// =============================================

const getTopicsByChapter = async (chapterId) => {
  const chapter = await practiceModel.getChapterById(chapterId);
  if (!chapter) throw new Error('Chapter পাওয়া যায়নি');
  const topics = await practiceModel.getTopicsByChapter(chapterId);
  return { chapter, topics };
};

const getTopicsBySubject = async (subjectId, classLevel) => {
  return await practiceModel.getTopicsBySubject(subjectId, classLevel);
};

// =============================================
// QUESTIONS
// =============================================

const getQuestionsByTopic = async (topicId, difficulty) => {
  const questions = await practiceModel.getQuestionsByTopic(topicId, difficulty);
  if (!questions.length) throw new Error('এই topic এ কোনো প্রশ্ন নেই');
  return questions;
};

const getQuestionById = async (questionId) => {
  const question = await practiceModel.getQuestionById(questionId);
  if (!question) throw new Error('প্রশ্ন পাওয়া যায়নি');

  // Solution সরাসরি দেবো না — শুধু question এর তথ্য দেবো
  const { solution, best_solution, hint_level_1, hint_level_2, hint_level_3, ...safeQuestion } = question;
  return safeQuestion;
};

const getBoardQuestions = async (classLevel, subjectId) => {
  return await practiceModel.getBoardQuestions(classLevel, subjectId);
};

// =============================================
// HINTS
// =============================================

const getHint = async (questionId, level, userId) => {
  // Question আছে কিনা check
  const question = await practiceModel.getQuestionById(questionId);
  if (!question) throw new Error('প্রশ্ন পাওয়া যায়নি');

  // Hint আনো
  const hint = await practiceModel.getHintByLevel(questionId, level);
  if (!hint) throw new Error(`Level ${level} এর hint পাওয়া যায়নি`);

  return {
    question_id: questionId,
    level,
    hint,
    // Level 3 হলে জানিয়ে দাও প্রায় উত্তর দেখছে
    is_final_hint: level === 3,
  };
};

// =============================================
// SUBMISSIONS
// =============================================

const submitAnswer = async ({
  userId, questionId, userAnswer, imageUrl,
  hintUsedLevel, timeTakenSec, planId, scheduleId
}) => {
  // Question আনো
  const question = await practiceModel.getQuestionById(questionId);
  if (!question) throw new Error('প্রশ্ন পাওয়া যায়নি');

  // অন্তত একটা answer থাকতে হবে
  if (!userAnswer && !imageUrl) {
    throw new Error('উত্তর বা ছবি দেওয়া আবশ্যক');
  }

  // Submission save করো
  const submissionId = await practiceModel.createSubmission({
    userId, questionId, planId, scheduleId,
    userAnswer, imageUrl, hintUsedLevel, timeTakenSec,
  });

  // Static evaluation — solution এর সাথে compare করো
  const evaluation = evaluateAnswer(question, userAnswer);

  // Score update করো
  await practiceModel.updateSubmissionScore(
    submissionId,
    evaluation.score,
    'evaluated'
  );

  // Feedback save করো
  await practiceModel.createFeedback({
    submissionId,
    feedbackBody:        evaluation.feedbackBody,
    errorDetails:        evaluation.errorDetails,
    improvedVersion:     evaluation.improvedVersion,
    alternativeSolution: question.best_solution,
    stepByStep:          question.solution,
    marksBreakdown:      evaluation.marksBreakdown,
  });

  // Progress update করো
  const chapter = await practiceModel.getChapterById(
    (await practiceModel.getQuestionById(questionId)).topic_id
  );

  await practiceModel.updateUserProgress(
    userId,
    chapter?.id || 1,
    question.subject_id,
    evaluation.isCorrect
  );

  return {
    submission_id: submissionId,
    score:         evaluation.score,
    max_marks:     question.marks,
    is_correct:    evaluation.isCorrect,
    feedback:      evaluation.feedbackBody,
    solution:      question.solution,
    best_solution: question.best_solution,
  };
};

// Static evaluation logic
// AI model trained হলে এই function replace হবে
const evaluateAnswer = (question, userAnswer) => {

  // Image submission — manual review pending
  if (!userAnswer) {
    return {
      score:        0,
      isCorrect:    false,
      feedbackBody: 'তোমার ছবি জমা হয়েছে। শীঘ্রই review করা হবে।',
      errorDetails:     null,
      improvedVersion:  null,
      marksBreakdown:   null,
    };
  }

  const answer   = userAnswer.trim().toLowerCase();
  const solution = (question.solution || '').toLowerCase();

  // Basic keyword matching (temporary — AI দিয়ে replace হবে)
  const answerWords   = new Set(answer.split(/\s+/).filter(w => w.length > 2));
  const solutionWords = new Set(solution.split(/\s+/).filter(w => w.length > 2));

  let matchCount = 0;
  solutionWords.forEach(word => {
    if (answerWords.has(word)) matchCount++;
  });

  const matchRatio = solutionWords.size > 0
    ? matchCount / solutionWords.size
    : 0;

  const score     = Math.round(matchRatio * question.marks);
  const isCorrect = matchRatio >= 0.6;

  let feedbackBody = '';
  if (matchRatio >= 0.8) {
    feedbackBody = 'চমৎকার! তোমার উত্তর প্রায় সঠিক। ✅';
  } else if (matchRatio >= 0.5) {
    feedbackBody = 'ভালো চেষ্টা! কিছুটা সঠিক আছে, তবে আরো বিস্তারিত লেখা দরকার।';
  } else {
    feedbackBody = 'আরেকবার চেষ্টা করো। নিচের সঠিক উত্তরটা দেখো।';
  }

  return {
    score,
    isCorrect,
    feedbackBody,
    errorDetails:     null,
    improvedVersion:  null,
    marksBreakdown:   { obtained: score, total: question.marks },
  };
};

const getSubmissionDetails = async (submissionId, userId) => {
  const submission = await practiceModel.getSubmissionById(submissionId);
  if (!submission) throw new Error('Submission পাওয়া যায়নি');

  // শুধু নিজের submission দেখতে পারবে
  if (submission.user_id !== userId) {
    throw new Error('এই submission দেখার অনুমতি নেই');
  }

  const feedback = await practiceModel.getFeedbackBySubmission(submissionId);
  return { submission, feedback };
};

const getUserHistory = async (userId, subjectId, limit) => {
  return await practiceModel.getUserSubmissions(userId, subjectId, limit);
};

module.exports = {
  getSubjects,
  getBooksByClass,
  getChaptersByBook,
  getChaptersBySubjectAndClass,
  getTopicsByChapter,
  getTopicsBySubject,
  getQuestionsByTopic,
  getQuestionById,
  getBoardQuestions,
  getHint,
  submitAnswer,
  getSubmissionDetails,
  getUserHistory,
};