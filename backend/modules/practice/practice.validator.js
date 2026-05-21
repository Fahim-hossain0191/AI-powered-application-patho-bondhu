const Joi = require('joi');

const getQuestionsSchema = Joi.object({
  topic_id:   Joi.number().integer().required()
    .messages({ 'any.required': 'Topic ID দেওয়া আবশ্যক' }),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
});

const getHintSchema = Joi.object({
  question_id: Joi.number().integer().required()
    .messages({ 'any.required': 'Question ID দেওয়া আবশ্যক' }),
  level: Joi.number().integer().min(1).max(3).required()
    .messages({ 'any.required': 'Hint level (1-3) দেওয়া আবশ্যক' }),
});

const submitAnswerSchema = Joi.object({
  question_id:      Joi.number().integer().required()
    .messages({ 'any.required': 'Question ID দেওয়া আবশ্যক' }),
  user_answer:      Joi.string().optional().allow('', null),
  image_url:        Joi.string().uri().optional().allow('', null),
  hint_used_level:  Joi.number().integer().min(0).max(3).default(0),
  time_taken_sec:   Joi.number().integer().optional(),
  plan_id:          Joi.number().integer().optional().allow(null),
  schedule_id:      Joi.number().integer().optional().allow(null),
});

const getBoardQuestionsSchema = Joi.object({
  subject_id: Joi.number().integer().optional(),
});

module.exports = {
  getQuestionsSchema,
  getHintSchema,
  submitAnswerSchema,
  getBoardQuestionsSchema,
};