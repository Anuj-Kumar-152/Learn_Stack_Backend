const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.user);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.user, req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

// ADMIN ONLY endpoint for creating users (including other admins/employees)
exports.createAdminOrEmployee = async (req, res) => {
    try {
        // Since we reach here, the roleMiddleware already verified the user is ADMIN
        // Admin-created accounts should be auto-verified (isVerified: true)
        const newUser = await userService.createAdminOrEmployee(req.body);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
