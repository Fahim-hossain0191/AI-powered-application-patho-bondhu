const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .min(2).max(100)
    .required()
    .messages({
      'string.min': 'নাম কমপক্ষে ২ অক্ষরের হতে হবে',
      'any.required': 'নাম দেওয়া আবশ্যক',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'সঠিক email দাও',
      'any.required': 'Email দেওয়া আবশ্যক',
    }),

  password: Joi.string()
    .min(6).max(50)
    .required()
    .messages({
      'string.min': 'Password কমপক্ষে ৬ অক্ষরের হতে হবে',
      'any.required': 'Password দেওয়া আবশ্যক',
    }),

  class_level: Joi.number()
    .integer().min(6).max(10)
    .required()
    .messages({
      'number.min': 'Class ৬ থেকে ১০ এর মধ্যে হতে হবে',
      'any.required': 'Class level দেওয়া আবশ্যক',
    }),

  gender: Joi.string()
    .valid('male', 'female', 'other')
    .optional(),

  phone_number: Joi.string()
    .pattern(/^01[3-9]\d{8}$/)
    .optional()
    .messages({
      'string.pattern.base': 'সঠিক বাংলাদেশি phone number দাও',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({ 'any.required': 'Email দেওয়া আবশ্যক' }),

  password: Joi.string().required()
    .messages({ 'any.required': 'Password দেওয়া আবশ্যক' }),
});

module.exports = { registerSchema, loginSchema };