const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   avatar: {
      type: String
   },
   coverImage: {
      type: String
   },
   summary: {
      type: String,
      required: false,
      trim: true
   },
   socialUrls: [
      {
         name: String,
         url: String,
         username: String
      }
   ],
   colleges: [
      {
         collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College"
         },
         start: {
            type: Date,
            default: Date.now
         },
         end: {
            type: Date
         },
         isPresent: {
            type: Boolean,
            default: false
         },
         grade: { type: String },
         summary: { type: String }
      }
   ]
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);