const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const { checkAccess } = require('./accessControl');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createProblem = async (user, problemData) => {
    checkAccess(user);
    const newProblem = new Problem({
        ...problemData,
        userId: user._id
    });
    return await newProblem.save();
};

exports.updateProblem = async (user, problemId, updateData) => {
    checkAccess(user);
    const updatedProblem = await Problem.findByIdAndUpdate(
        problemId,
        updateData,
        { new: true, runValidators: true }
    );
    if (!updatedProblem) {
        throw new Error('Problem not found');
    }
    return updatedProblem;
};

exports.getAllProblems = async () => {
    return await Problem.find().populate('userId', 'name username');
};

exports.getProblemById = async (problemId) => {
    const query = isValidObjectId(problemId) ? { _id: problemId } : { slug: problemId };
    const problem = await Problem.findOne(query).populate('userId', 'name username');
    if (!problem) {
        throw new Error('Problem not found');
    }
    return problem;
};

exports.deleteProblem = async (user, problemId) => {
    checkAccess(user);
    const deletedProblem = await Problem.findByIdAndDelete(problemId);
    if (!deletedProblem) {
        throw new Error('Problem not found');
    }
    return deletedProblem;
};
