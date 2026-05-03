const subjectService = require('../services/subjectService');

exports.createSubject = async (req, res) => {
    try {
        const result = await subjectService.createSubject(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const result = await subjectService.updateSubject(req.user, req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const result = await subjectService.getAllSubjects();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const result = await subjectService.getSubjectById(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await subjectService.deleteSubject(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
