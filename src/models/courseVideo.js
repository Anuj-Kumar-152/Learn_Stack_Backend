const mongoose = require("mongoose");

const CourseVideoSchema = new mongoose.Schema({
   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   summary: { type: String },
   duration: { type: String },
   title: { type: String, required: true },
   thumbnailImage: { type: String },
   videoUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("CourseVideo", CourseVideoSchema);