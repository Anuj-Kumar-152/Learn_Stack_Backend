const profileService = require('../services/profileService');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');

exports.createProfile = async (req, res) => {
    try {
        let profileData = { ...req.body };
        
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'learnstack_avatars', 'image');
            profileData.avatar = uploadResult.secure_url;
        }

        const result = await profileService.createProfile(req.user, profileData);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        let profileData = { ...req.body };
        
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'learnstack_avatars', 'image');
            profileData.avatar = uploadResult.secure_url;
        }

        const result = await profileService.updateProfile(req.user, req.params.id, profileData);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
        const result = await profileService.getProfileByUserId(req.user._id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.getProfileByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });
        const result = await profileService.getProfileByUserId(userId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await profileService.deleteProfile(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
