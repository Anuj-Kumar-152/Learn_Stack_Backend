const Course = require('../models/Course');
const { checkAccess } = require('./accessControl');

exports.createCourse = async (user, courseData) => {
    checkAccess(user);
    const newCourse = new Course({
        ...courseData,
        userId: user._id
    });
    return await newCourse.save();
};

exports.updateCourse = async (user, courseId, updateData) => {
    checkAccess(user);
    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        updateData,
        { new: true, runValidators: true }
    );
    if (!updatedCourse) {
        throw new Error('Course not found');
    }
    return updatedCourse;
};

exports.getAllCourses = async () => {
    return await Course.find().populate('userId', 'name username');
};

exports.getCourseById = async (courseId) => {
    const course = await Course.findById(courseId).populate('userId', 'name username');
    if (!course) {
        throw new Error('Course not found');
    }
    return course;
};

exports.deleteCourse = async (user, courseId) => {
    checkAccess(user);
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
        throw new Error('Course not found');
    }
    return deletedCourse;
};
