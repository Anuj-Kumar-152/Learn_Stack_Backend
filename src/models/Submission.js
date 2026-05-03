const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
   code: { type: String },
   language: String,
   status: String, // Accepted / Wrong Answer / Runtime Error
   passed: Number,
   total: Number
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);