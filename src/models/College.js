const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
   name: { type: String, required: true, unique: true, lowercase: true },
   location: { type: String, default: "" },
   state: { type: String, default: "" },
   country: { type: String, default: "" },
   addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   summary: { type: String, default: "" },
   slug: { type: String, required: true, unique: true },
   collegeIcon: { type: String, default: "" },
   collegeCoverImage: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("College", collegeSchema);