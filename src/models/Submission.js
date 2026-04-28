const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
   userId: String, // future ke liye
   problemSlug: String,

   code: String,
   language: String,

   status: String, // Accepted / Wrong Answer / Runtime Error
   passed: Number,
   total: Number,

   createdAt: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model("Submission", submissionSchema);