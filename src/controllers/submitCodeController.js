const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const Problem = require("../models/Problem");
const generateWrapper = require("../utils/generateWrapper");

const Submission = require("../models/Submission");
const User = require("../models/User"); // 🔥 ADD

const submitCodeController = async (req, res) => {
   const { code, slug, userId } = req.query;

    

   try {
      const problem = await Problem.findOne({ slug });

      if (!problem) {
         res.write(`data: ${JSON.stringify({ status: "Problem Not Found ❌" })}\n\n`);
         return res.end();
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders && res.flushHeaders();

      const send = (data) => {
         res.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      const tempDir = path.join(__dirname, "../../temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

      const fileId = Date.now();
      const className = `Main_${fileId}`;

      const finalCode = generateWrapper(code, problem, className);

      const filePath = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(filePath, finalCode);

      // COMPILE
      try {
         execSync(`javac "${filePath}"`);
      } catch (err) {

         await Submission.create({
            userId,
            problemSlug: slug,
            code,
            language: "java",
            status: "Compilation Error ❌",
            passed: 0,
            total: 0
         });

         send({ status: "Compilation Error ❌" });
         return res.end();
      }

      // LOAD TEST CASES
      let testCases = [];

      try {
         const filePath = path.join(__dirname, "../testcases", `${slug}.json`);
         const rawData = fs.readFileSync(filePath, "utf-8");
         const parsed = JSON.parse(rawData);
         testCases = parsed.testCases || [];
      } catch (err) {
         send({ status: "Test Case File Missing ❌" });
         return res.end();
      }

      let passed = 0;
      const total = testCases.length;

      // RUN
      for (let i = 0; i < total; i++) {

         const tc = testCases[i];

         const inputFile = path.join(tempDir, `input_${fileId}_${i}.txt`);
         fs.writeFileSync(inputFile, tc.input);

         let output;

         try {
            output = execSync(
               `java -cp "${tempDir}" ${className} < "${inputFile}"`,
               { timeout: 2000 }
            ).toString();
         } catch (err) {

            await Submission.create({
               userId,
               problemSlug: slug,
               code,
               language: "java",
               status: "Runtime Error ❌",
               passed,
               total
            });

            send({
               status: "Runtime Error ❌",
               passed,
               total,
               index: i + 1
            });

            return res.end();
         }

         const normalize = (str) =>
            str.replace(/\r/g, "").trim().split(/\s+/).join(" ");

         const userOut = normalize(output);
         const expectedOut = normalize(tc.output);

         if (userOut !== expectedOut) {

            await Submission.create({
               userId,
               problemSlug: slug,
               code,
               language: "java",
               status: "Wrong Answer ❌",
               passed,
               total
            });

            send({
               status: "Wrong Answer ❌",
               passed,
               total,
               failedCase: {
                  input: tc.input,
                  output: userOut,
                  expected: expectedOut,
                  index: i + 1
               }
            });

            return res.end();
         }

         passed++;

         await new Promise((r) => setTimeout(r, 40));

         send({ type: "progress", passed, total });
      }

      // ✅ ACCEPTED + MARKS
      console.log("✅ Accepted - Saving submission");

      const alreadySolved = await Submission.findOne({
         userId,
         problemSlug: slug,
         status: "Accepted ✔"
      });

      if (!alreadySolved && userId) {

         let marks = 0; 

         if (problem.difficulty === "Basic") marks = 1;
         else if (problem.difficulty === "Easy") marks = 2;
         else if (problem.difficulty === "Medium") marks = 4;
         else if (problem.difficulty === "Hard") marks = 8;
         else marks = 0;

         

         // 🔥🔥🔥 ONLY ADD THIS (NO CHANGE)
         const user = await User.findById(userId);

         if (user) {

            const already = user.solvedQuestions?.find(
               q => q.problemSlug === slug
            );

            if (!already) {

               user.solvedQuestions.push({
                  problemSlug: slug,
                  title: problem.title,
                  difficulty: problem.difficulty
               });

               user.score += marks;

               await user.save();

                
            }
         }
      }

      await Submission.create({
         userId,
         problemSlug: slug,
         code,
         language: "java",
         status: "Accepted ✔",
         passed,
         total
      });

      send({
         status: "Accepted ✔",
         passed,
         total
      });

      res.end();

   } catch (err) {
      console.log("🔥 Server Error:", err);

      res.write(`data: ${JSON.stringify({ status: "Server Error ❌" })}\n\n`);
      res.end();
   }
};

module.exports = submitCodeController;



// const fs = require("fs");
// const path = require("path");
// const { execSync } = require("child_process");
// const Problem = require("../models/Problem");
// const generateWrapper = require("../utils/generateWrapper");

// const Submission = require("../models/Submission");

// const submitCodeController = async (req, res) => {
//    const { code, slug, userId } = req.query;   // 🔥 FIX HERE

//    // 🔥 DEBUG
//    console.log("🚀 SUBMIT CONTROLLER HIT");
//    console.log("👤 USER ID:", userId);
//    console.log("🧪 FULL QUERY:", req.query);

//    try {
//       const problem = await Problem.findOne({ slug });

//       if (!problem) {
//          res.write(`data: ${JSON.stringify({ status: "Problem Not Found ❌" })}\n\n`);
//          return res.end();
//       }

//       res.setHeader("Content-Type", "text/event-stream");
//       res.setHeader("Cache-Control", "no-cache");
//       res.setHeader("Connection", "keep-alive");
//       res.flushHeaders && res.flushHeaders();

//       const send = (data) => {
//          res.write(`data: ${JSON.stringify(data)}\n\n`);
//       };

//       const tempDir = path.join(__dirname, "../../temp");
//       if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

//       const fileId = Date.now();
//       const className = `Main_${fileId}`;

//       const finalCode = generateWrapper(code, problem, className);

//       const filePath = path.join(tempDir, `${className}.java`);
//       fs.writeFileSync(filePath, finalCode);

//       // 🔥 COMPILE
//       try {
//          execSync(`javac "${filePath}"`);
//       } catch (err) {

//          console.log("❌ Compilation Error - Saving submission");

//          await Submission.create({
//             userId,   // 🔥 SAME VARIABLE (ab correct aayega)
//             problemSlug: slug,
//             code,
//             language: "java",
//             status: "Compilation Error ❌",
//             passed: 0,
//             total: 0
//          });

//          send({ status: "Compilation Error ❌" });
//          return res.end();
//       }

//       // ================= LOAD TEST CASES =================
//       let testCases = [];

//       try {
//          const filePath = path.join(__dirname, "../testcases", `${slug}.json`);
//          const rawData = fs.readFileSync(filePath, "utf-8");
//          const parsed = JSON.parse(rawData);
//          testCases = parsed.testCases || [];
//       } catch (err) {
//          console.log("❌ Test case file not found:", err);
//          send({ status: "Test Case File Missing ❌" });
//          return res.end();
//       }

//       let passed = 0;
//       const total = testCases.length;

//       // ================= RUN =================
//       for (let i = 0; i < total; i++) {

//          const tc = testCases[i];

//          const inputFile = path.join(tempDir, `input_${fileId}_${i}.txt`);
//          fs.writeFileSync(inputFile, tc.input);

//          let output;

//          try {
//             output = execSync(
//                `java -cp "${tempDir}" ${className} < "${inputFile}"`,
//                { timeout: 2000 }
//             ).toString();
//          } catch (err) {

//             console.log("❌ Runtime Error at case:", i + 1);

//             await Submission.create({
//                userId,
//                problemSlug: slug,
//                code,
//                language: "java",
//                status: "Runtime Error ❌",
//                passed,
//                total
//             });

//             send({
//                status: "Runtime Error ❌",
//                passed,
//                total,
//                index: i + 1
//             });

//             return res.end();
//          }

//          const normalize = (str) =>
//             str.replace(/\r/g, "").trim().split(/\s+/).join(" ");

//          const userOut = normalize(output);
//          const expectedOut = normalize(tc.output);

//          if (userOut !== expectedOut) {

//             console.log("❌ Wrong Answer at case:", i + 1);

//             await Submission.create({
//                userId,
//                problemSlug: slug,
//                code,
//                language: "java",
//                status: "Wrong Answer ❌",
//                passed,
//                total
//             });

//             send({
//                status: "Wrong Answer ❌",
//                passed,
//                total,
//                failedCase: {
//                   input: tc.input,
//                   output: userOut,
//                   expected: expectedOut,
//                   index: i + 1
//                }
//             });

//             return res.end();
//          }

//          passed++;

//          await new Promise((r) => setTimeout(r, 40));

//          console.log("📤 Progress:", passed, "/", total);

//          send({ type: "progress", passed, total });
//       }

//       console.log("✅ Accepted - Saving submission");

//       await Submission.create({
//          userId,
//          problemSlug: slug,
//          code,
//          language: "java",
//          status: "Accepted ✔",
//          passed,
//          total
//       });

//       send({
//          status: "Accepted ✔",
//          passed,
//          total
//       });

//       res.end();

//    } catch (err) {
//       console.log("🔥 Server Error:", err);

//       res.write(`data: ${JSON.stringify({ status: "Server Error ❌" })}\n\n`);
//       res.end();
//    }
// };

// module.exports = submitCodeController;



 