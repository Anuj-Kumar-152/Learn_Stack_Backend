const Submission = require("../models/Submission");
const User = require("../models/User");
const Problem = require("../models/Problem"); // ya Question model

// 🔥 CREATE SUBMISSION (MAIN FIX YAHI HAI)
const createSubmission = async (req, res) => {
   try {
      const {
         problemSlug,
         code,
         language,
         status,
         passed,
         total
      } = req.body;

      const userId = req.user.userId;

      // ✅ existing logic (same)
      const submission = await Submission.create({
         userId,
         problemSlug,
         code,
         language,
         status,
         passed,
         total
      });

      console.log("📥 Submission created:", submission.problemSlug);
      console.log("📊 Status:", submission.status);

      // 🔥🔥🔥 ONLY ADD THIS BLOCK (NO CHANGE ANYWHERE ELSE)
      if (submission.status === "Accepted") {

         const user = await User.findById(userId);

         if (user) {

            // 🔥 duplicate check
            const already = user.solvedQuestions?.find(
               q => q.problemSlug === submission.problemSlug
            );

            if (!already) {

               const problem = await Problem.findOne({ slug: submission.problemSlug });

               if (problem) {

                  user.solvedQuestions.push({
                     problemSlug: submission.problemSlug,
                     title: problem.title,
                     difficulty: problem.difficulty
                  });

                  // 🔥 score system
                  if (problem.difficulty === "Easy") user.score += 1;
                  if (problem.difficulty === "Medium") user.score += 4;
                  if (problem.difficulty === "Hard") user.score += 8;

                  await user.save();

                  console.log("✅ SOLVED SAVED:", problem.title);
               } else {
                  console.log("❌ Problem not found");
               }

            } else {
               console.log("⚠ Already solved");
            }
         }
      }

      // ✅ response same
      res.json(submission);

   } catch (err) {
      console.error("🔥 Submission Error:", err);
      res.status(500).json({ error: "Server Error" });
   }
};


// 🔥 EXISTING (UNCHANGED)
const getSubmissions = async (req, res) => {
   try {
      const { slug } = req.params;
      const { userId } = req.query;

      console.log("📥 Fetch submissions API hit");
      console.log("📌 Slug:", slug);
      console.log("👤 UserId:", userId);

      const submissions = await Submission
         .find({ problemSlug: slug, userId })
         .sort({ createdAt: -1 })
         .limit(20);

      console.log("📊 Total submissions found:", submissions.length);

      if (submissions.length > 0) {
         console.log("🧪 First submission sample:", submissions[0]);
      }

      res.json(submissions);

   } catch (err) {
      console.log("🔥 Error fetching submissions:", err);
      res.status(500).json({ error: "Server Error" });
   }
};

module.exports = {
   createSubmission, // 🔥 ADD THIS
   getSubmissions
};








// const Submission = require("../models/Submission");

// const getSubmissions = async (req, res) => {
//    try {
//       const { slug } = req.params;

//       // 🔥 ADD (userId from query)
//       const { userId } = req.query;

//       console.log("📥 Fetch submissions API hit");
//       console.log("📌 Slug:", slug);
//       console.log("👤 UserId:", userId);

//       const submissions = await Submission
//          .find({ problemSlug: slug, userId }) // 🔥 ONLY CHANGE
//          .sort({ createdAt: -1 })
//          .limit(20);

//       console.log("📊 Total submissions found:", submissions.length);

//       if (submissions.length > 0) {
//          console.log("🧪 First submission sample:", submissions[0]);
//       }

//       res.json(submissions);

//    } catch (err) {
//       console.log("🔥 Error fetching submissions:", err);
//       res.status(500).json({ error: "Server Error" });
//    }
// };

// module.exports = { getSubmissions };


 