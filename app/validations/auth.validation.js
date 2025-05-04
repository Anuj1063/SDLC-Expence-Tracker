const Joi = require("joi");

class JoiValidator {
  registerValidation = Joi.object({
    firstName: Joi.string().required().messages({
      "string.base": "First name must be text",
      "any.required": "First name is required",
    }),

    lastName: Joi.string().required().messages({
      "string.base": "Last name must be text",
      "any.required": "Last name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters",
      "any.required": "Password is required",
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords must match",
        "any.required": "Confirm password is required",
      }),
  });

  loginValidation = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });

  verifyOtpValidation = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    otp: Joi.string().required().messages({
      "any.required": "OTP is required",
    }),
  });
  resendOtpValidation = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  });
  forgetPasswordValidation = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  });
  resetPasswordValidation = Joi.object({
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters",
      "any.required": "Password is required",
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords must match",
        "any.required": "Confirm password is required",
      }),
  });

  updatePasswordValidation = Joi.object({
    currentPassword: Joi.string().required().messages({
      "any.required": "current password is required",
    }),
    newPassword: Joi.string().min(8).required().messages({
      "string.min": "New password must be at least 8 characters",
      "any.required": "New password is required",
    }),
    confirmNewPassword: Joi.string()
    .required()
      .valid(Joi.ref("newPassword"))
      
      .messages({
        'any.only': 'Confirm password must match new password',
        'any.required': 'Confirm new password is required',
      }),
  });
}
module.exports = new JoiValidator();
