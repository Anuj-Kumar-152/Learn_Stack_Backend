const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   slug: {
      type: String,
      unique: true,
      required: true
   },
   title: {
      type: String,
      required: true,
      unique: true,
      trim: true
   },
   summary: {
      type: String,
      required: true,
      trim: true
   },
   level: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"]
   },
   referenceUrls: [
      {
         platformName: {
            type: String,
            required: true
         },
         url: String
      }
   ],
   examples: [
      {
         input: {
            type: String,
            required: true
         },
         output: {
            type: String,
            required: true
         },
         summary: {
            type: String
         }
      }
   ],
   timeComplexity: {
      type: String
   },
   snippets: [
      {
         languageName: String,
         snippet: String
      }
   ],
   hint: {
      type: String,
      trim: true
   }
}, { timestamps: true });

module.exports = mongoose.model("Problem", ProblemSchema);