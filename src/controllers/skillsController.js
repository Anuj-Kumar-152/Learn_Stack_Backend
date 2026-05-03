const skillsService = require('../services/skillsService');

exports.createSkill = async (req, res) => {
    try {
        const result = await skillsService.createSkill(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const result = await skillsService.updateSkill(req.user, req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getMySkills = async (req, res) => {
    try {
        const result = await skillsService.getUserSkills(req.user._id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserSkills = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });
        const result = await skillsService.getUserSkills(userId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        await skillsService.deleteSkill(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
