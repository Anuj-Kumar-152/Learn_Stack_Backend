const mongoose = require('mongoose');
const Topic = require('../models/topic');
const Subject = require('../models/subject');
const { checkAccess } = require('./accessControl');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeTopicData = (topicData, { partial = false } = {}) => {
    const data = {};

    if (!partial || topicData.name !== undefined) {
        data.name = topicData.name?.trim();
    }

    if (!partial || topicData.slug !== undefined) {
        data.slug = topicData.slug?.trim().toLowerCase();
    }

    if (!partial || topicData.summary !== undefined) {
        data.summary = topicData.summary?.trim() || '';
    }

    if (!partial || topicData.subjectId !== undefined) {
        data.subjectId = topicData.subjectId;
    }

    return data;
};

const ensureSubjectExists = async (subjectId) => {
    if (!subjectId || !isValidObjectId(subjectId)) {
        throw new Error('Valid subject ID is required');
    }

    const subjectExists = await Subject.exists({ _id: subjectId });
    if (!subjectExists) {
        throw new Error('Subject not found');
    }
};

exports.createTopic = async (user, topicData) => {
    checkAccess(user);
    const data = normalizeTopicData(topicData);

    if (!data.name) {
        throw new Error('Topic name is required');
    }

    if (!data.slug) {
        throw new Error('Topic slug is required');
    }

    await ensureSubjectExists(data.subjectId);

    const newTopic = new Topic({
        ...data,
        author: user._id
    });

    try {
        const topic = await newTopic.save();
        return await topic.populate(['author', 'subjectId']);
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Topic slug already exists');
        }
        throw error;
    }
};

exports.updateTopic = async (user, topicId, updateData) => {
    checkAccess(user);

    if (!isValidObjectId(topicId)) {
        throw new Error('Valid topic ID is required');
    }

    const data = normalizeTopicData(updateData, { partial: true });
    if (data.subjectId) {
        await ensureSubjectExists(data.subjectId);
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
        topicId,
        data,
        { new: true, runValidators: true }
    ).populate(['author', 'subjectId']);

    if (!updatedTopic) {
        throw new Error('Topic not found');
    }

    return updatedTopic;
};

exports.getAllTopics = async () => {
    return await Topic.find()
        .populate('author', 'name username')
        .populate('subjectId', 'name slug');
};

exports.getTopicsBySubject = async (subjectId) => {
    if (!isValidObjectId(subjectId)) {
        throw new Error('Valid subject ID is required');
    }

    return await Topic.find({ subjectId })
        .populate('author', 'name username')
        .populate('subjectId', 'name slug');
};

exports.getTopicById = async (topicId) => {
    const query = isValidObjectId(topicId) ? { _id: topicId } : { slug: topicId };
    const topic = await Topic.findOne(query)
        .populate('author', 'name username')
        .populate('subjectId', 'name slug');

    if (!topic) {
        throw new Error('Topic not found');
    }

    return topic;
};

exports.deleteTopic = async (user, topicId) => {
    checkAccess(user);

    if (!isValidObjectId(topicId)) {
        throw new Error('Valid topic ID is required');
    }

    // Delete all content items related to this topic
    const Content = require('../models/content');
    await Content.deleteMany({ topicId });

    const deletedTopic = await Topic.findByIdAndDelete(topicId);
    if (!deletedTopic) {
        throw new Error('Topic not found');
    }
    return deletedTopic;
};
