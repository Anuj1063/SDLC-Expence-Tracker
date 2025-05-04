const deleteFile = require('../../../helper/deleteFile');

const profileRepositories = require('../repositories/profile.repositories');

class ProfileController {
  async createProfile(req, res) {
    try {
      const userId = req.user?._id;
    
      const profilePic = req.file?.filename;
      const { address, phone } = req.body;
        
      if (!userId) {
        if (profilePic) deleteFile("uploads/profile", profilePic);
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!profilePic) {
        return res.status(400).json({ message: "Profile picture is required" });
      }

      // Fetch user and check existence
      const user = await profileRepositories.findUser(userId);
      if (!user) {
        if (profilePic) deleteFile("uploads/profile", profilePic);
        return res.status(404).json({success:false, message: "User not found" });
      }

      // Check if profile already exists
      const existingProfile = await profileRepositories.findProfileByUserId(userId);
      if (existingProfile) {
        if (profilePic) deleteFile("uploads/profile", profilePic);
        return res.status(400).json({ message: "Profile already exists for this user" });
      }

      const fullName = `${user.firstName} ${user.lastName}`;

      // Create new profile
      const newProfile = await profileRepositories.createProfile({
        userId,
        profilePic,
        fullname: fullName,
        address,
        phone,
      })

      return res.status(201).json({ message: "Profile created successfully", profile: newProfile });

    } catch (err) {
        const profilePic = req.file?.filename;
      console.error("CreateProfile Error:", err.message);
      if (profilePic) deleteFile("uploads/profile", profilePic);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async showProfile(req,res){
    try {
      const userId = req.user._id; 
      const email = req.user.email
      const profile = await profileRepositories.findProfileByUserId(userId)
      const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  console.log(baseUrl,"333")
      if(profile){
        return res.status(200).json({
          success:true,
          profile: {
            ...profile.toObject(),
            email,
            profilePic: profile.profilePic 
              ? `${baseUrl}/uploads/user/${profile.profilePic}` 
              : null
          }
        })
      }
    
      
    } catch (error) {
      console.log("Something Went Wrong",error)
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user?._id;
      const uploadedPic = req.file?.filename;
  
      if (!userId) {
        if (uploadedPic) deleteFile("uploads/user", uploadedPic);
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const existingProfile = await profileRepositories.findProfileByUserId(userId);
      if (!existingProfile) {
        if (uploadedPic) deleteFile("uploads/user", uploadedPic);
        return res.status(404).json({ message: "Profile not found" });
      }
  
      const { firstName, lastName, address, phone } = req.body;
  
      if (phone && !/^\d{10}$/.test(phone)) {
        if (uploadedPic) deleteFile("uploads/user", uploadedPic);
        return res.status(400).json({ message: "Phone must be exactly 10 digits" });
      }
  
      let newProfilePic = existingProfile.profilePic;
  
      // Replace profile picture if new one uploaded
      if (uploadedPic) {
        if (existingProfile.profilePic) {
          deleteFile("uploads/user", existingProfile.profilePic); // delete old pic
        }
        newProfilePic = uploadedPic;
      }
  
      let newFullName = existingProfile.fullname;
  
      // Update user name if provided
      if (firstName || lastName) {
        const user = await profileRepositories.findUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        const updatedFirstName = firstName || user.firstName;
        const updatedLastName = lastName || user.lastName;
        newFullName = `${updatedFirstName} ${updatedLastName}`;
  
        await profileRepositories.updateUserName(userId, updatedFirstName, updatedLastName);
      }
  
      const updatedProfile = await profileRepositories.updateProfileByUserId(userId, {
        profilePic: newProfilePic,
        address,
        phone,
        fullname: newFullName,
      });
  
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const formattedProfile = {
        ...updatedProfile.toObject(),
        profilePic: newProfilePic ? `${baseUrl}/uploads/user/${newProfilePic}` : null,
      };
  
      return res.status(200).json({
        message: "Profile updated successfully",
        profile: formattedProfile,
      });
  
    } catch (err) {
      const uploadedPic = req.file?.filename;
      console.error("UpdateProfile Error:", err.message);
      if (uploadedPic) deleteFile("uploads/user", uploadedPic);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new ProfileController();
