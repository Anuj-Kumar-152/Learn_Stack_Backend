const mongoose = require("mongoose");

const SkillsSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   level: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] },
   name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Skill", SkillsSchema);