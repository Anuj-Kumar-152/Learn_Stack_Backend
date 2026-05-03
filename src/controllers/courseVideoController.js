const courseVideoService = require('../services/courseVideoService');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');

exports.createCourseVideo = async (req, res) => {
    try {
        let videoData = { ...req.body };
        
        // Handle file upload if present
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'learnstack_videos', 'video');
            videoData.videoUrl = uploadResult.secure_url;
        }

        const result = await courseVideoService.createCourseVideo(req.user, videoData);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateCourseVideo = async (req, res) => {
    try {
        let videoData = { ...req.body };
        
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'learnstack_videos', 'video');
            videoData.videoUrl = uploadResult.secure_url;
        }

        const result = await courseVideoService.updateCourseVideo(req.user, req.params.id, videoData);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllCourseVideos = async (req, res) => {
    try {
        const result = await courseVideoService.getAllCourseVideos();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCourseVideoById = async (req, res) => {
    try {
        const result = await courseVideoService.getCourseVideoById(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.deleteCourseVideo = async (req, res) => {
    try {
        await courseVideoService.deleteCourseVideo(req.user, req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
