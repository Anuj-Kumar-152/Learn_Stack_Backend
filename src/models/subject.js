const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   isPrograming: {
      type:Boolean
   },
   name: {
      type: String,
      required: true,
      unique: true
   },
   slug: {
      type: String,
      required: true,
      unique: true
   },
   summary: {
      type: String
   },
   icon: {
      type: String
   },
   coverImage: {
      type: String
   }
}, { timestamps: true });

module.exports = mongoose.model("Subject", SubjectSchema);