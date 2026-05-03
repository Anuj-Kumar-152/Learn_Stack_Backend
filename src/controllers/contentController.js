const contentService = require('../services/contentService');

exports.createContent = async (req, res) => {
    try {
        const result = await contentService.createContent(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateContent = async (req, res) => {
    try {
        const result = await contentService.updateContent(req.user, req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllContents = async (req, res) => {
    try {
        const result = await contentService.getAllContents();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getContentById = async (req, res) => {
    try {
        const result = await contentService.getContentById(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.getContentsByTopic = async (req, res) => {
    try {
        const result = await contentService.getContentsByTopic(req.params.topicId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteContent = async (req, res) => {
    try {
        await contentService.deleteContent(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
