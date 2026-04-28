const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
   slug: { type: String, required: true },
   title: String,
   content: String,
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;   // ✅ IMPORTANT