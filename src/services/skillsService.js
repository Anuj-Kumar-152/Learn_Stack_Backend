const Skill = require('../models/skills');

exports.createSkill = async (user, skillData) => {
    const newSkill = new Skill({
        ...skillData,
        userId: user._id
    });
    return await newSkill.save();
};

exports.updateSkill = async (user, skillId, updateData) => {
    const skill = await Skill.findById(skillId);
    if (!skill) throw new Error('Skill not found');
    
    if (skill.userId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
        throw new Error('Access Denied');
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
        skillId,
        updateData,
        { new: true, runValidators: true }
    );
    return updatedSkill;
};

exports.getUserSkills = async (userId) => {
    return await Skill.find({ userId }).populate('userId', 'name username');
};

exports.deleteSkill = async (user, skillId) => {
    const skill = await Skill.findById(skillId);
    if (!skill) throw new Error('Skill not found');
    
    if (skill.userId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
        throw new Error('Access Denied');
    }

    return await Skill.findByIdAndDelete(skillId);
};
