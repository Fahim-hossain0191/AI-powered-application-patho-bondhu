const {
  checkExerciseText,
  checkExerciseImage,
  solveQuestion,
  checkSolution,
  checkImage,
} = require('./jachai.service');
const { success, error } = require('../../../utils/response');

/**
 * POST /api/math/jachai/exercise-check-text
 *
 * Frontend থেকে আসবে:
 * { exercise_id: 5, student_answer: "..." }
 *
 * Frontend পাবে:
 * { is_correct, feedback, show_solution, full_solution, points }
 */
async function exerciseCheckTextController(req, res) {
  try {
    const { exercise_id, student_answer } = req.body;

    if (!exercise_id || !student_answer) {
      return error(res, 'exercise_id এবং student_answer দিতে হবে', 400);
    }

    const result = await checkExerciseText(exercise_id, student_answer);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * POST /api/math/jachai/exercise-check-image
 *
 * Frontend থেকে আসবে:
 * { exercise_id: 5, image_base64: "...", image_mime: "image/jpeg" }
 *
 * Frontend এ ছবি base64 করবে এভাবে:
 * const reader = new FileReader()
 * reader.readAsDataURL(file)
 * reader.onload = () => {
 *   const base64 = reader.result.split(',')[1]
 * }
 */
async function exerciseCheckImageController(req, res) {
  try {
    const { exercise_id, image_base64, image_mime = 'image/jpeg' } = req.body;

    if (!exercise_id || !image_base64) {
      return error(res, 'exercise_id এবং image_base64 দিতে হবে', 400);
    }

    const result = await checkExerciseImage(exercise_id, image_base64, image_mime);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * POST /api/math/jachai/solve
 *
 * Frontend থেকে আসবে:
 * { question: "...", chapter_id: 3 }
 */
async function solveController(req, res) {
  try {
    const { question, chapter_id } = req.body;

    if (!question) {
      return error(res, 'প্রশ্ন দিতে হবে', 400);
    }

    const result = await solveQuestion(question, chapter_id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * POST /api/math/jachai/check
 *
 * Frontend থেকে আসবে:
 * { question: "...", student_solution: "...", chapter_id: 3 }
 */
async function checkController(req, res) {
  try {
    const { question, student_solution, chapter_id } = req.body;

    if (!question || !student_solution) {
      return error(res, 'প্রশ্ন এবং solution দিতে হবে', 400);
    }

    const result = await checkSolution(question, student_solution, chapter_id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * POST /api/math/jachai/image
 *
 * Frontend থেকে আসবে:
 * { image_base64: "...", image_mime: "image/jpeg" }
 */
async function imageController(req, res) {
  try {
    const { image_base64, image_mime = 'image/jpeg' } = req.body;

    if (!image_base64) {
      return error(res, 'ছবি দিতে হবে', 400);
    }

    const result = await checkImage(image_base64, image_mime);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  exerciseCheckTextController,
  exerciseCheckImageController,
  solveController,
  checkController,
  imageController,
};
