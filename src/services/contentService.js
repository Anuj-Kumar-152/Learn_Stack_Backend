const mongoose = require('mongoose');
const Content = require('../models/content');
const Topic = require('../models/topic');
const { checkAccess } = require('./accessControl');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const ensureTopicExists = async (topicId) => {
    if (!topicId || !isValidObjectId(topicId)) {
        throw new Error('Valid topic ID is required');
    }

    const topicExists = await Topic.exists({ _id: topicId });
    if (!topicExists) {
        throw new Error('Topic not found');
    }
};

exports.createContent = async (user, contentData) => {
    checkAccess(user);

    if (!contentData.summary?.trim()) {
        throw new Error('Content summary is required');
    }

    await ensureTopicExists(contentData.topicId);

    const newContent = new Content({
        summary: contentData.summary.trim(),
        images: contentData.images || [],
        topicId: contentData.topicId,
        authorId: user._id
    });

    const content = await newContent.save();
    return await content.populate(['authorId', 'topicId']);
};

exports.updateContent = async (user, contentId, updateData) => {
    checkAccess(user);

    if (!isValidObjectId(contentId)) {
        throw new Error('Valid content ID is required');
    }

    if (updateData.topicId) {
        await ensureTopicExists(updateData.topicId);
    }

    const data = {
        ...updateData,
        ...(updateData.summary !== undefined ? { summary: updateData.summary.trim() } : {})
    };

    const updatedContent = await Content.findByIdAndUpdate(
        contentId,
        data,
        { new: true, runValidators: true }
    ).populate(['authorId', 'topicId']);

    if (!updatedContent) {
        throw new Error('Content not found');
    }

    return updatedContent;
};

exports.getAllContents = async () => {
    return await Content.find()
        .populate('authorId', 'name username')
        .populate({
            path: 'topicId',
            select: 'name slug',
            populate: {
                path: 'subjectId',
                select: 'name slug'
            }
        });
};

exports.getContentsByTopic = async (topicId) => {
    if (!isValidObjectId(topicId)) {
        throw new Error('Valid topic ID is required');
    }

    return await Content.find({ topicId })
        .populate('authorId', 'name username')
        .populate({
            path: 'topicId',
            select: 'name slug',
            populate: {
                path: 'subjectId',
                select: 'name slug'
            }
        });
};

exports.getContentById = async (contentId) => {
    if (!isValidObjectId(contentId)) {
        throw new Error('Valid content ID is required');
    }

    const content = await Content.findById(contentId)
        .populate('authorId', 'name username')
        .populate({
            path: 'topicId',
            select: 'name slug',
            populate: {
                path: 'subjectId',
                select: 'name slug'
            }
        });
    if (!content) {
        throw new Error('Content not found');
    }
    return content;
};

exports.deleteContent = async (user, contentId) => {
    checkAccess(user);

    if (!isValidObjectId(contentId)) {
        throw new Error('Valid content ID is required');
    }

    const deletedContent = await Content.findByIdAndDelete(contentId);
    if (!deletedContent) {
        throw new Error('Content not found');
    }
    return deletedContent;
};
