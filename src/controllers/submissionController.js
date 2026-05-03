const submissionService = require('../services/submissionService');

exports.createSubmission = async (req, res) => {
    try {
        const result = await submissionService.createSubmission(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateSubmission = async (req, res) => {
    try {
        const result = await submissionService.updateSubmission(req.user, req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllSubmissions = async (req, res) => {
    try {
        const result = await submissionService.getAllSubmissions();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMySubmissions = async (req, res) => {
    try {
        const result = await submissionService.getUserSubmissions(req.user._id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserSubmissions = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });
        const result = await submissionService.getUserSubmissions(userId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSubmissionById = async (req, res) => {
    try {
        const result = await submissionService.getSubmissionById(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.deleteSubmission = async (req, res) => {
    try {
        await submissionService.deleteSubmission(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};