const mongoose = require('mongoose');
const College = require('../models/College');
const { checkAccess } = require('./accessControl');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createCollege = async (user, collegeData) => {
    // Both Admins and normal users might be able to suggest colleges
    const newCollege = new College({
        ...collegeData,
        addedBy: user?._id
    });
    return await newCollege.save();
};

exports.updateCollege = async (user, collegeId, updateData) => {
    // Generally only admins should modify global college data
    checkAccess(user);
    const updatedCollege = await College.findByIdAndUpdate(
        collegeId,
        updateData,
        { new: true, runValidators: true }
    );
    if (!updatedCollege) {
        throw new Error('College not found');
    }
    return updatedCollege;
};

exports.getAllColleges = async () => {
    return await College.find().populate('addedBy', 'name username');
};

exports.getCollegeById = async (collegeId) => {
    const query = isValidObjectId(collegeId) ? { _id: collegeId } : { slug: collegeId };
    const college = await College.findOne(query).populate('addedBy', 'name username');
    if (!college) {
        throw new Error('College not found');
    }
    return college;
};

exports.deleteCollege = async (user, collegeId) => {
    checkAccess(user);
    const deletedCollege = await College.findByIdAndDelete(collegeId);
    if (!deletedCollege) {
        throw new Error('College not found');
    }
    return deletedCollege;
};
