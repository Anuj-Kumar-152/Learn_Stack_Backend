const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   title: { type: String, required: true },
   name: { type: String, required: true },
   icon: { type: String },
   bgImage: { type: String },
   summary: { type: String },
   startDate: { type: Date },
   endDate: { type: Date },
   price: { type: Number, default: 0 },
   duration: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema);
