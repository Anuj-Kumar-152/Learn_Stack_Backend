const mongoose = require("mongoose");

// ✅ ADD THIS
const parameterSchema = new mongoose.Schema({
   type: String,
   name: String
});

const problemSchema = new mongoose.Schema({
   title: { type: String, required: true },

   slug: { type: String, required: true, unique: true },

   difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
   },

   description: String,
   constraints: String,

   // ✅ ADD THIS
   functionName: {
      type: String,
      default: "solve"
   },

   returnType: {
      type: String,
      default: "int"
   },

   parameters: [parameterSchema],

   examples: [
      {
         input: String,
         output: String,
         explanation: String
      }
   ],

   testCases: [
      {
         input: String,
         output: String,
         hidden: Boolean
      }
   ],
 

}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);