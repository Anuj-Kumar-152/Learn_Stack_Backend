const Submission = require('../models/Submission');

exports.createSubmission = async (user, submissionData) => {
    const newSubmission = new Submission({
        ...submissionData,
        userId: user._id
    });
    return await newSubmission.save();
};

exports.updateSubmission = async (user, submissionId, updateData) => {
    // Only the user who created it should modify it, or admin
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error('Submission not found');
    
    if (submission.userId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
        throw new Error('Access Denied');
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
        submissionId,
        updateData,
        { new: true, runValidators: true }
    );
    return updatedSubmission;
};

exports.getAllSubmissions = async () => {
    return await Submission.find().populate('userId', 'name username').populate('problemId', 'title');
};

exports.getUserSubmissions = async (userId) => {
    return await Submission.find({ userId }).populate('problemId', 'title');
};

exports.getSubmissionById = async (submissionId) => {
    const submission = await Submission.findById(submissionId).populate('userId', 'name username').populate('problemId', 'title');
    if (!submission) {
        throw new Error('Submission not found');
    }
    return submission;
};

exports.deleteSubmission = async (user, submissionId) => {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error('Submission not found');
    
    if (submission.userId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
        throw new Error('Access Denied');
    }

    return await Submission.findByIdAndDelete(submissionId);
};
