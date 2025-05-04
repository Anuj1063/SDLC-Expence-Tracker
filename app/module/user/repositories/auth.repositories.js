const userModel = require("../model/user.model");
const emailVerifyModel = require("../model/otp.model");

class AuthRepository {
  async findUserByEmail(email) {
    return userModel.findOne({ email });
  }

  async createUser(data) {
    return userModel.create(data);
  }

  async updateUserPassword(userId, password) {
    return userModel.findOneAndUpdate({ _id: userId }, { $set: { password } });
  }
  async  updateUserRefreshToken(userId, token) {
    return userModel.findByIdAndUpdate(userId, { refreshToken: token });
  }

  async markUserVerified(userId) {
    return userModel.findByIdAndUpdate(userId, { isVerified: true });
  }

  async deleteUserOtps(userId) {
    return emailVerifyModel.deleteMany({ userId });
  }

  async findOtpRecord(userId, otp) {
    return emailVerifyModel.findOne({ userId, otp });
  }
  async deleteUserById(userId) {
    return await userModel.findByIdAndDelete(userId);
  }

  async findUserById(id) {
    return userModel.findById(id);
  }
}

module.exports = new AuthRepository();
