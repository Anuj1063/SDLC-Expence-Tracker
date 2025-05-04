// backgroundCleanup.js

const userModel = require('../module/profile/model/profile.model'); // Correct path to your userModel

const deleteOldUnverifiedUsers = async () => {
  const expirationTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

  try {
    const result = await userModel.deleteMany({
      isVerified: false,
      createdAt: { $lt: expirationTime }
    });
    console.log(`Deleted ${result.deletedCount} old unverified users.`);
  } catch (error) {
    console.error('Error cleaning up old unverified users:', error);
  }
};

module.exports = deleteOldUnverifiedUsers;
