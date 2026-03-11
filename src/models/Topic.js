const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   slug: {
      type: String,
      required: true,
      unique: true
   },
   content: {
      type: String,
      required: true
   }
});

module.exports = mongoose.model("Topic", topicSchema);