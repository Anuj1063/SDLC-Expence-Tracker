const express = require("express");
const authController = require("../../module/user/controller/auth.controller");
const AuthCheck = require("../../middleware/auth.middleware")()
const validateRequest = require("../../middleware/validate.request");
const joiValidator = require("../../validations/auth.validation");
const router = express.Router();

router.post(
  "/register",
  validateRequest(joiValidator.registerValidation),
  authController.registerUser
);
router.post(
  "/login",
  validateRequest(joiValidator.loginValidation),
  authController.loginUser
);
router.post(
  "/verify-otp",
  validateRequest(joiValidator.verifyOtpValidation),
  authController.verifyOtp
);
router.post(
  "/resend-otp",
  validateRequest(joiValidator.resendOtpValidation),
  authController.resendOtp
);
router.post(
  "/forget-password",
  validateRequest(joiValidator.forgetPasswordValidation),
  authController.forgetPassword
);
router.post(
  "/reset-password/:token",
  validateRequest(joiValidator.resetPasswordValidation),
  authController.resetPassword
);
router.post(
  "/update-password",
  AuthCheck.authenticateAPI,
  validateRequest(joiValidator.updatePasswordValidation),
  authController.updatePassword
);
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/logout", AuthCheck.authenticateAPI, authController.logout);

module.exports = router;
