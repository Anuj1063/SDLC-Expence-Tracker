const Joi = require('joi');

const createProfileSchema = Joi.object({
  address: Joi.string().trim().required().messages({
    'any.required': 'Address is required',
  }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'any.required': 'Phone number is required',
      'string.pattern.base': 'Phone must be exactly 10 digits',
    }),
});

const updateProfileSchema = Joi.object({
  address: Joi.string().trim().optional(),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone must be exactly 10 digits',
    }),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
});

module.exports = {
  createProfileSchema,
  updateProfileSchema,
};
