const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
   authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true
   },
   title: {
      type:String
   },
   summary: {
      type: String,
      required: true
   },
   images: [
      {
         type: String
      }
   ]
}, { timestamps: true });

module.exports = mongoose.model("Content", ContentSchema);