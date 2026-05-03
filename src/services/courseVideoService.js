const CourseVideo = require('../models/CourseVideo');
const { checkAccess } = require('./accessControl');

exports.createCourseVideo = async (user, videoData) => {
    checkAccess(user);
    const newVideo = new CourseVideo({
        ...videoData,
        userId: user._id
    });
    return await newVideo.save();
};

exports.updateCourseVideo = async (user, videoId, updateData) => {
    checkAccess(user);
    const updatedVideo = await CourseVideo.findByIdAndUpdate(
        videoId,
        updateData,
        { new: true, runValidators: true }
    );
    if (!updatedVideo) {
        throw new Error('CourseVideo not found');
    }
    return updatedVideo;
};

exports.getAllCourseVideos = async () => {
    return await CourseVideo.find().populate('userId', 'name username').populate('courseId', 'title');
};

exports.getVideosByCourse = async (courseId) => {
    return await CourseVideo.find({ courseId }).populate('userId', 'name username');
};

exports.getCourseVideoById = async (videoId) => {
    const video = await CourseVideo.findById(videoId).populate('userId', 'name username').populate('courseId', 'title');
    if (!video) {
        throw new Error('CourseVideo not found');
    }
    return video;
};

exports.deleteCourseVideo = async (user, videoId) => {
    checkAccess(user);
    const deletedVideo = await CourseVideo.findByIdAndDelete(videoId);
    if (!deletedVideo) {
        throw new Error('CourseVideo not found');
    }
    return deletedVideo;
};
