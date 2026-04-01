require("dotenv").config();
const mongoose = require("mongoose");

const Problem = require("../models/Problem");
const { getTestCases } = require("../utils/generatorMap");

// ======================
// 🔥 CONNECT DB
// ======================
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
   .then(() => console.log("✅ MongoDB Connected"))
   .catch(err => console.error("❌ DB Error:", err));


// ======================
// 🔥 SEED FUNCTION
// ======================
const seedProblems = async () => {
   try {

      // 🧹 optional: old data delete
      await Problem.deleteMany({ slug: "sum-of-two-numbers" });

      // ======================
      // 🔥 INSERT PROBLEM
      // ======================
      await Problem.create({
         title: "Sum of Two Numbers",
         slug: "sum-of-two-numbers",
         difficulty: "Easy",

         description: "Given two integers a and b, return their sum.",
         constraints: "1 <= a, b <= 1000",

         examples: [
            {
               input: "2 3",
               output: "5",
               explanation: "2 + 3 = 5"
            }
         ],

         // 🔥 AUTO GENERATED TEST CASES
         testCases: getTestCases("sum-of-two-numbers"),

         // 🔥 FUNCTION INFO
         functionName: "solve",
         returnType: "int",

         parameters: [
            { type: "int", name: "a" },
            { type: "int", name: "b" }
         ],

         // 🔥 BOILERPLATE
         boilerplate: {
            java: `class Solution {
    public int solve(int a, int b) {
        
    }
}`
         }
      });

      console.log("🔥 Problem seeded successfully!");
      process.exit();

   } catch (err) {
      console.error("❌ Error:", err);
      process.exit(1);
   }
};

// ======================
// 🚀 RUN
// ======================
seedProblems();