const Profile = require('../models/profile');

exports.createProfile = async (user, profileData) => {
    // Ensure profile doesn't already exist
    const existingProfile = await Profile.findOne({ userId: user._id });
    if (existingProfile) {
        throw new Error('Profile already exists for this user');
    }

    const newProfile = new Profile({
        ...profileData,
        userId: user._id
    });
    return await newProfile.save();
};

exports.updateProfile = async (user, profileId, updateData) => {
    const profile = await Profile.findById(profileId);
    if (!profile) throw new Error('Profile not found');
    
    if (profile.userId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
        throw new Error('Access Denied');
    }

    // Prevent changing ownership
    delete updateData.userId;

    const updatedProfile = await Profile.findByIdAndUpdate(
        profileId,
        updateData,
        { new: true, runValidators: true }
    );
    return updatedProfile;
};

exports.getProfileByUserId = async (userId) => {
    const profile = await Profile.findOne({ userId })
        .populate('userId', 'name username email')
        .populate('colleges.collegeId', 'name');
    if (!profile) throw new Error('Profile not found');
    return profile;
};

exports.deleteProfile = async (user, profileId) => {
    const profile = await Profile.findById(profileId);
    if (!profile) throw new Error('Profile not found');
    
    if (profile.userId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
        throw new Error('Access Denied');
    }

    return await Profile.findByIdAndDelete(profileId);
};
