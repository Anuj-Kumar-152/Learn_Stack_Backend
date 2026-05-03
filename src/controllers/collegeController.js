const collegeService = require('../services/collegeService');

exports.createCollege = async (req, res) => {
    try {
        const result = await collegeService.createCollege(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateCollege = async (req, res) => {
    try {
        const result = await collegeService.updateCollege(req.user, req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllColleges = async (req, res) => {
    try {
        const result = await collegeService.getAllColleges();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCollegeById = async (req, res) => {
    try {
        const result = await collegeService.getCollegeById(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.deleteCollege = async (req, res) => {
    try {
        await collegeService.deleteCollege(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
