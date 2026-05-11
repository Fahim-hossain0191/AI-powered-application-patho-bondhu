const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({ 'any.required': 'নাম দেওয়া আবশ্যক' }),

  email: Joi.string().email().required()
    .messages({ 'any.required': 'Email দেওয়া আবশ্যক' }),

  password: Joi.string().min(6).required()
    .messages({ 'string.min': 'Password কমপক্ষে ৬ অক্ষর' }),

  class_level: Joi.number().integer().min(6).max(10).required()
    .messages({ 'any.required': 'Class level দেওয়া আবশ্যক' }),

  phone_number: Joi.string()
    .pattern(/^01[3-9]\d{8}$/).optional().allow('', null),

  gender: Joi.string()
    .valid('male', 'female', 'other').optional().allow('', null),

  medium: Joi.string()
    .valid('bangla', 'english').optional().allow('', null),

  favourite_subjects: Joi.array().items(Joi.string()).optional().default([]),

  hobbies: Joi.array().items(Joi.string()).optional().default([]),

  learning_styles: Joi.array().items(Joi.string()).optional().default([]),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };