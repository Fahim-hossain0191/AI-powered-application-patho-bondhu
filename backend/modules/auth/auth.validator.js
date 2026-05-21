const Joi = require('joi');

const registerSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required()
    .messages({ 'any.required': 'নাম দেওয়া আবশ্যক' }),

  email: Joi.string().email().required()
    .messages({ 'any.required': 'Email দেওয়া আবশ্যক' }),

  password: Joi.string().min(6).required()
    .messages({ 'string.min': 'Password কমপক্ষে ৬ অক্ষর' }),

  class: Joi.string().required()
    .messages({ 'any.required': 'Class দেওয়া আবশ্যক' }),

  phone: Joi.string().optional().allow('', null),

  school_name: Joi.string().optional().allow('', null),

  board_name: Joi.string().optional().allow('', null),

  profile_image_url: Joi.string().uri().optional().allow('', null),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };