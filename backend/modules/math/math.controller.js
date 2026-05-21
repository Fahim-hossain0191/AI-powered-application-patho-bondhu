const pool = require('../../config/db');
const { sendSuccess, sendError } = require('../../utils/response.utils');

const AI_MODULE_URL = process.env.AI_MODULE_URL || 'http://127.0.0.1:8000';

const forwardToAI = async (endpoint, payload) => {
  const response = await fetch(`${AI_MODULE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI Module Error (${response.status}): ${errText}`);
  }
  return await response.json();
};

const logActivity = async (userId, actionType, itemId, itemType, points, metadata) => {
  try {
    const query = `
      INSERT INTO activities (user_id, action_type, item_id, item_type, points_earned, metadata) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [userId, actionType, itemId, itemType, points, JSON.stringify(metadata)]);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

const updatePoints = async (userId, subjectId, chapterId, actionType, points, description) => {
  try {
    const query = `
      INSERT INTO user_points (user_id, subject_id, chapter_id, action_type, points, description) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [userId, subjectId, chapterId, actionType, points, description]);
  } catch (err) {
    console.error('Failed to update points:', err);
  }
};

// 1. MCQ Generate
const mcqGenerate = async (req, res) => {
  try {
    const { chapter_id, count, previously_generated } = req.body;
    const aiData = await forwardToAI('/math/mcq/generate', { chapter_id, count, previously_generated });
    
    await logActivity(req.user.id, 'mcq_generate', chapter_id, 'chapter', 0, { count });
    return sendSuccess(res, aiData, 'MCQs generated successfully');
  } catch (err) {
    return sendError(res, 'Failed to generate MCQs: ' + err.message, 500);
  }
};

// 2. Answer Check (Text)
const answerCheckText = async (req, res) => {
  try {
    const { exercise_id, student_answer, subject_id, chapter_id } = req.body;
    const aiData = await forwardToAI('/math/answer/check-text', { exercise_id, student_answer });
    
    // AI Data is expected to return something like { is_correct: true/false, feedback: ... }
    // Add logic here depending on the exact structure returned by AI
    const isCorrect = aiData.is_correct || false; 
    const points = isCorrect ? 10 : 0;
    
    await logActivity(req.user.id, 'answer_submission', exercise_id, 'exercise', points, { isCorrect, type: 'text' });
    if (points > 0) {
      await updatePoints(req.user.id, subject_id || null, chapter_id || null, 'correct_answer', points, 'Correct answer to exercise');
    }

    return sendSuccess(res, aiData, 'Answer evaluated');
  } catch (err) {
    return sendError(res, 'Failed to evaluate answer: ' + err.message, 500);
  }
};

// 3. Answer Check (Image)
const answerCheckImage = async (req, res) => {
  try {
    const { exercise_id, image_base64, image_mime, subject_id, chapter_id } = req.body;
    const aiData = await forwardToAI('/math/answer/check-image', { exercise_id, image_base64, image_mime });
    
    const isCorrect = aiData.is_correct || false;
    const points = isCorrect ? 10 : 0;

    await logActivity(req.user.id, 'answer_submission_image', exercise_id, 'exercise', points, { isCorrect, type: 'image' });
    if (points > 0) {
      await updatePoints(req.user.id, subject_id || null, chapter_id || null, 'correct_answer_image', points, 'Correct image answer to exercise');
    }

    return sendSuccess(res, aiData, 'Image answer evaluated');
  } catch (err) {
    return sendError(res, 'Failed to evaluate image answer: ' + err.message, 500);
  }
};

// 4. Get Hint
const getHint = async (req, res) => {
  try {
    const { exercise_id, phase, subject_id, chapter_id } = req.body;
    const aiData = await forwardToAI('/math/hint', { exercise_id, phase });

    const pointsDeducted = -5; // Example penalty for taking a hint
    await logActivity(req.user.id, 'hint_usage', exercise_id, 'exercise', pointsDeducted, { phase });
    await updatePoints(req.user.id, subject_id || null, chapter_id || null, 'hint_usage', pointsDeducted, `Used hint phase ${phase}`);

    return sendSuccess(res, aiData, 'Hint generated successfully');
  } catch (err) {
    return sendError(res, 'Failed to process hint request: ' + err.message, 500);
  }
};

// 5. Jachai Solve
const jachaiSolve = async (req, res) => {
  try {
    const { question, chapter_id } = req.body;
    const aiData = await forwardToAI('/math/jachai/solve', { question, chapter_id });
    
    await logActivity(req.user.id, 'jachai_solve', chapter_id, 'chapter', 0, { question });
    return sendSuccess(res, aiData, 'Solved successfully');
  } catch (err) {
    return sendError(res, 'Failed to solve question: ' + err.message, 500);
  }
};

// 6. Jachai Check
const jachaiCheck = async (req, res) => {
  try {
    const { question, student_solution, chapter_id } = req.body;
    const aiData = await forwardToAI('/math/jachai/check', { question, student_solution, chapter_id });
    
    await logActivity(req.user.id, 'jachai_check', chapter_id, 'chapter', 0, { checked: true });
    return sendSuccess(res, aiData, 'Solution checked successfully');
  } catch (err) {
    return sendError(res, 'Failed to check solution: ' + err.message, 500);
  }
};

// 7. Jachai Image
const jachaiImage = async (req, res) => {
  try {
    const { image_base64, image_mime } = req.body;
    const aiData = await forwardToAI('/math/jachai/image', { image_base64, image_mime });
    
    await logActivity(req.user.id, 'jachai_image', null, 'image_upload', 0, { image_mime });
    return sendSuccess(res, aiData, 'Image processed successfully');
  } catch (err) {
    return sendError(res, 'Failed to process image: ' + err.message, 500);
  }
};

// 8. Get Exercises from DB
const getExercises = async (req, res) => {
  try {
    const { chapter_id } = req.query;
    const chapterId = chapter_id ? parseInt(chapter_id) : 3; // default to Chapter 3
    const [rows] = await pool.query(
      `SELECT exercise_id, exercise_number, question_text, question_pattern, solution_steps, display_order 
       FROM math_exercises 
       WHERE chapter_id = ? 
       ORDER BY exercise_number ASC, display_order ASC`,
      [chapterId]
    );

    const exercises = rows.map((row) => {
      // Find expected final answer if present in solution_steps (e.g. "উত্তর: 322")
      let expected = "";
      if (row.solution_steps) {
        const match = row.solution_steps.match(/উত্তর:\s*(.+)$/m);
        if (match) {
          expected = match[1].trim();
        }
      }
      
      const title = `অনুশীলনী ${row.exercise_number} - প্রশ্ন ${row.display_order}`;
      return {
        id: row.exercise_id,
        title: title,
        question: row.question_text,
        expected: expected,
        exercise_number: row.exercise_number,
        display_order: row.display_order
      };
    });

    return sendSuccess(res, exercises, 'Exercises retrieved successfully');
  } catch (err) {
    return sendError(res, 'Failed to fetch exercises: ' + err.message, 500);
  }
};

module.exports = {
  mcqGenerate,
  answerCheckText,
  answerCheckImage,
  getHint,
  jachaiSolve,
  jachaiCheck,
  jachaiImage,
  getExercises
};
