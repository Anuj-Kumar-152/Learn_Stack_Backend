const User = require('../models/User');
const bcrypt = require('bcrypt');
const { checkAccess } = require('./accessControl');

exports.createUser = async (userData) => {
    // Registration logic
    const newUser = new User(userData);
    return await newUser.save();
};

exports.createAdminOrEmployee = async (userData) => {
    // Admin-created users should be auto-verified
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new User({
        ...userData,
        password: hashedPassword,
        isVerified: true  // Auto-verify admin-created accounts
    });
    return await newUser.save();
};

exports.updateUser = async (currentUser, userIdToUpdate, updateData) => {
    // A user can update their own data, or an ADMIN can update any user
    if (currentUser._id.toString() !== userIdToUpdate.toString() && currentUser.role !== 'ADMIN') {
        throw new Error('Access Denied');
    }

    // Prevent standard users from elevating their role
    if (updateData.role && currentUser.role !== 'ADMIN') {
        delete updateData.role;
    }

    const updatedUser = await User.findByIdAndUpdate(
        userIdToUpdate,
        updateData,
        { new: true, runValidators: true }
    );

    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
};

exports.getAllUsers = async (currentUser) => {
    checkAccess(currentUser); // typically only admins/employees list all users
    return await User.find().select('-password -accessToken -refreshToken');
};

exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password -accessToken -refreshToken');
    if (!user) throw new Error('User not found');
    return user;
};

exports.deleteUser = async (currentUser, userIdToDelete) => {
    // Only admins can delete users
    if (currentUser.role !== 'ADMIN') {
        throw new Error('Only admins can delete users');
    }

    const deletedUser = await User.findByIdAndDelete(userIdToDelete);
    if (!deletedUser) throw new Error('User not found');
    return deletedUser;
};
