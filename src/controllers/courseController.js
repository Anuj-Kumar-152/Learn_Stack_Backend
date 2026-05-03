const courseService = require('../services/courseService');

exports.createCourse = async (req, res) => {
    try {
        const result = await courseService.createCourse(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const result = await courseService.updateCourse(req.user, req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const result = await courseService.getAllCourses();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const result = await courseService.getCourseById(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await courseService.deleteCourse(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
