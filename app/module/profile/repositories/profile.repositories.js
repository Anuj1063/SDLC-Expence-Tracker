const profileModel = require("../model/profile.model");
const userModel = require("../../user/model/user.model");

class ProfileRepositories {
    // Find User by ID
    async findUser(userId) {
        return await userModel.findById(userId);
    }

    // Find Profile by userId
    async findProfileByUserId(userId) {
        return await profileModel.findOne({ userId });
    }

    findProfileById = async (id) => {
        return await profileModel.findOne({ _id: id });
    };
    // Create New Profile
    async createProfile(profileData) {
        return await profileModel.create(profileData);
    }

    // Update Profile by userId
    async updateProfileByUserId(userId, updateData) {
        return await profileModel.findOneAndUpdate(
            { userId },
            updateData,
            { new: true }
        );
    }

    // Update User Name
    async updateUserName(userId, updatedFirstName, updatedLastName) {
        return await userModel.findByIdAndUpdate(
            userId,
            { firstName: updatedFirstName, lastName: updatedLastName }
        );
    }
}

module.exports = new ProfileRepositories();
