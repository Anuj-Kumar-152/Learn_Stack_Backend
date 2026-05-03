const mongoose = require('mongoose');
const Subject = require('../models/subject');
const Topic = require('../models/topic');
const { checkAccess } = require('./accessControl');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeSubjectData = (subjectData, { partial = false } = {}) => {
    const data = {};

    if (!partial || subjectData.name !== undefined) {
        data.name = subjectData.name?.trim();
    }

    if (!partial || subjectData.slug !== undefined) {
        data.slug = subjectData.slug?.trim().toLowerCase();
    }

    if (!partial || subjectData.summary !== undefined) {
        data.summary = subjectData.summary?.trim() || '';
    }

    if (!partial || subjectData.icon !== undefined) {
        data.icon = subjectData.icon?.trim() || '';
    }

    if (!partial || subjectData.coverImage !== undefined) {
        data.coverImage = subjectData.coverImage?.trim() || '';
    }

    return data;
};

exports.createSubject = async (user, subjectData) => {
    checkAccess(user);
    const data = normalizeSubjectData(subjectData);

    if (!data.name) {
        throw new Error('Subject name is required');
    }

    if (!data.slug) {
        throw new Error('Subject slug is required');
    }

    const newSubject = new Subject({
        ...data,
        userId: user._id
    });

    try {
        const subject = await newSubject.save();
        return await subject.populate('userId', 'name username');
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Subject name or slug already exists');
        }
        throw error;
    }
};

exports.updateSubject = async (user, subjectId, updateData) => {
    checkAccess(user);

    if (!isValidObjectId(subjectId)) {
        throw new Error('Valid subject ID is required');
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
        subjectId,
        normalizeSubjectData(updateData, { partial: true }),
        { new: true, runValidators: true }
    ).populate('userId', 'name username');

    if (!updatedSubject) {
        throw new Error('Subject not found');
    }

    return updatedSubject;
};

exports.getAllSubjects = async () => {
    return await Subject.find().populate('userId', 'name username');
};

exports.getSubjectById = async (subjectId) => {
    const query = isValidObjectId(subjectId) ? { _id: subjectId } : { slug: subjectId };
    const subject = await Subject.findOne(query).populate('userId', 'name username');

    if (!subject) {
        throw new Error('Subject not found');
    }

    return subject;
};

exports.deleteSubject = async (user, subjectId) => {
    checkAccess(user);

    if (!isValidObjectId(subjectId)) {
        throw new Error('Valid subject ID is required');
    }

    // Also delete all topics and content related to this subject
    const topics = await Topic.find({ subjectId });
    for (let topic of topics) {
        // Delete content items related to this topic
        const Content = require('../models/content');
        await Content.deleteMany({ topicId: topic._id });
    }
    // Delete all topics for this subject
    await Topic.deleteMany({ subjectId });

    const deletedSubject = await Subject.findByIdAndDelete(subjectId);
    if (!deletedSubject) {
        throw new Error('Subject not found');
    }
    return deletedSubject;
};
