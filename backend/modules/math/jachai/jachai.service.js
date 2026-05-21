const { callAI } = require('../../../utils/aiClient');

/**
 * যাচাই — Exercise এর answer check করো
 * Text answer → AI Module
 */
async function checkExerciseText(exercise_id, student_answer) {
  return await callAI('/math/answer/check-text', {
    exercise_id,
    student_answer,
  });
}

/**
 * যাচাই — Exercise এর answer check করো
 * Image answer → AI Module
 */
async function checkExerciseImage(exercise_id, image_base64, image_mime) {
  return await callAI('/math/answer/check-image', {
    exercise_id,
    image_base64,
    image_mime,
  });
}

/**
 * যাচাই — যেকোনো প্রশ্ন solve করো
 */
async function solveQuestion(question, chapter_id) {
  return await callAI('/math/jachai/solve', {
    question,
    chapter_id,
  });
}

/**
 * যাচাই — নিজের solution check করো
 */
async function checkSolution(question, student_solution, chapter_id) {
  return await callAI('/math/jachai/check', {
    question,
    student_solution,
    chapter_id,
  });
}

/**
 * যাচাই — ছবি দিলে AI বুঝবে
 * শুধু প্রশ্ন → solve করবে
 * প্রশ্ন + solution → check করবে
 */
async function checkImage(image_base64, image_mime) {
  return await callAI('/math/jachai/image', {
    image_base64,
    image_mime,
  });
}

module.exports = {
  checkExerciseText,
  checkExerciseImage,
  solveQuestion,
  checkSolution,
  checkImage,
};
