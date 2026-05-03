const topicService = require('../services/topicService');

exports.createTopic = async (req, res) => {
    try {
        const result = await topicService.createTopic(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const result = await topicService.updateTopic(req.user, req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllTopics = async (req, res) => {
    try {
        const result = await topicService.getAllTopics();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTopicById = async (req, res) => {
    try {
        const result = await topicService.getTopicById(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.getTopicsBySubject = async (req, res) => {
    try {
        const result = await topicService.getTopicsBySubject(req.params.subjectId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        await topicService.deleteTopic(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
