const { getExercises, getExerciseById } = require('./exercise.service');
const { success, error } = require('../../../utils/response');

/**
 * GET /api/math/chapters/:id/exercises?difficulty=easy
 *
 * difficulty = easy / medium / hard / all (default)
 *
 * Frontend এ call করবে:
 * fetch('http://localhost:5000/api/math/chapters/3/exercises?difficulty=easy', {
 *   headers: { Authorization: `Bearer ${token}` }
 * })
 *
 * Frontend পাবে: exercises এর list
 * solution_steps আসবে না এখানে — শুধু question list
 */
async function getAllExercises(req, res) {
  try {
    const { id: chapter_id } = req.params;
    const { difficulty = 'all' } = req.query;

    const exercises = await getExercises(chapter_id, difficulty);
    return success(res, exercises);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * GET /api/math/exercises/:exercise_id/solution
 * Student "সমাধান দেখুন" button এ click করলে।
 * Frontend পাবে: solution_steps সহ full exercise
 */
async function getExerciseSolution(req, res) {
  try {
    const { exercise_id } = req.params;
    const exercise = await getExerciseById(exercise_id);

    if (!exercise) {
      return error(res, 'Exercise পাওয়া যায়নি', 404);
    }

    return success(res, exercise);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getAllExercises, getExerciseSolution };
