const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../../../config/email.config");
const authRepository = require("../repositories/auth.repositories");
const sendEmailVerificationOTP = require("../../../helper/sendEmailVerificationOTP");
const sendWelcomeEmail = require("../../../helper/successfulRegistrationEmail");
const refreshTokensStore = {};

class AuthController {
  async registerUser(req, res) {
    try {
      const { firstName, lastName, password, email } = req.body;

      const existingUser = await authRepository.findUserByEmail(email);

      if (existingUser) {
        if (existingUser.isVerified) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        } else {
          await authRepository.deleteUserById(existingUser._id);
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await authRepository.createUser({
        firstName,
        lastName,
        password: hashedPassword,
        email,
      });
      sendEmailVerificationOTP(user);

      return res.status(200).json({
        success: true,
        message: "Registration Successful. Please Verify Your Email",
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error in registerUser:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const user = await authRepository.findUserByEmail(email);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "Email not registered" });
      }
      if (user.isVerified) {
        return res
          .status(400)
          .json({ status: false, message: "Email already verified" });
      }

      const otpRecord = await authRepository.findOtpRecord(user._id, otp);
      if (!otpRecord) {
        return res.status(400).json({ status: false, message: "Invalid OTP" });
      }

      const isExpired =
        new Date() > new Date(otpRecord.createdAt.getTime() + 15 * 60 * 1000);
      if (isExpired) {
        await sendEmailVerificationOTP(user);
        return res
          .status(400)
          .json({ status: false, message: "OTP expired, new OTP sent" });
      }

      await authRepository.markUserVerified(user._id);
      await sendWelcomeEmail(user);
      await authRepository.deleteUserOtps(user._id);

      return res
        .status(200)
        .json({ status: true, message: "Email verified successfully" });
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  }

  async resendOtp(req, res) {
    try {
      const { email } = req.body;

      const user = await authRepository.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User is already verified",
        });
      }

      await authRepository.deleteUserOtps(user._id);

      await sendEmailVerificationOTP(user);

      return res.status(200).json({
        success: true,
        message: "New OTP sent successfully",
      });
    } catch (error) {
      console.error("Error in resendOtp:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await authRepository.findUserByEmail(email);
      if (!user || !user.isVerified)
        return res
          .status(401)
          .json({
            success: false,
            message: "Invalid credentials or not verified",
          });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });

      // Generate access and refresh tokens
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // Save refresh token (in DB/Redis ideally, here just memory)
      // refreshTokensStore[user._id] = refreshToken;
      // console.log(refreshTokensStore,"11")
      await authRepository.updateUserRefreshToken(user._id, refreshToken);

      

      res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error in loginUser:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
  async refreshAccessToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });
  
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await authRepository.findUserById(decoded.userId);
  
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
  
      const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });
  
      // Optional: rotate refresh token
      const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
      });
      await authRepository.updateUserRefreshToken(user._id, newRefreshToken);
  
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  }
  

  async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await authRepository.findUserByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const link = `${process.env.LOCAL_PORT_URL}/reset-password/${token}`;
      await transporter.sendMail({
        to: email,
        subject: "Password Reset",
        html: `<p>Hello ${user.name},</p>
                <p>Click the link below to reset your password:</p>
                <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thank you!</p>
                <p>Best regards,</p>
                <p>Team XYZ</p>
                <p><small>This is an automatically generated email. Please do not reply to this email.</small></p>
                <p><small>© 2025 Team Papai. All rights reserved.</small></p>
                <p><small>Powered by Papai</small></p>
                <p><small>Version 1.0</small></p>`,
      });

      return res.status(200).json({ message: "Email for Reset Password sent" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server Error", error: error.message });
    }
  }

  async updatePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      // Get user from DB
      const user = await authRepository.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if old password matches
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await authRepository.updateUserPassword(userId, hashedNewPassword);

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await authRepository.findUserById(decoded.userId);

      if (!user) return res.status(404).json({ message: "User not found" });

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
  async logout(req, res) {
    try {
      const userId = req.user.userId;
      await authRepository.updateUserRefreshToken(userId, null); // clear token
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new AuthController();
