const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const Problem = require("../models/Problem");
const generateWrapper = require("../utils/generateWrapper");

const submitCodeController = async (req, res) => {
   const { code, slug } = req.query;

   try {
      const problem = await Problem.findOne({ slug });

      if (!problem) {
         res.write(`data: ${JSON.stringify({ status: "Problem Not Found ❌" })}\n\n`);
         return res.end();
      }

      // 🔥 SSE HEADERS
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

      // 🔥 COMPILE
      try {
         execSync(`javac "${filePath}"`);
      } catch (err) {
         send({ status: "Compilation Error ❌" });
         return res.end();
      }

      // ================= LOAD TEST CASES FROM FILE =================
      let testCases = [];

      try {
         // ✅ FIX 1: __dirname (production safe)
         const filePath = path.join(__dirname, "../testcases", `${slug}.json`);

         const rawData = fs.readFileSync(filePath, "utf-8");

         const parsed = JSON.parse(rawData);

         // ✅ FIX 2: safe fallback
         testCases = parsed.testCases || [];
      } catch (err) {
         console.log("❌ Test case file not found:", err);
         send({ status: "Test Case File Missing ❌" });
         return res.end();
      }

      let passed = 0;
      const total = testCases.length;

      // ================= RUN =================
      for (let i = 0; i < total; i++) {

         const tc = testCases[i];

         // ✅ FIX 3: unique input file (no overwrite issue)
         const inputFile = path.join(tempDir, `input_${fileId}_${i}.txt`);
         fs.writeFileSync(inputFile, tc.input);

         let output;

         try {
            output = execSync(
               `java -cp "${tempDir}" ${className} < "${inputFile}"`,
               { timeout: 2000 }
            ).toString();
         } catch (err) {
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

         // 🔥 delay (same as before)
         await new Promise((r) => setTimeout(r, 40));

         console.log("📤 Progress:", passed, "/", total);

         // 🔥 LIVE PROGRESS
         send({ type: "progress", passed, total });
      }

      // ✅ SUCCESS
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

// const submitCodeController = async (req, res) => {
//    const { code, slug } = req.query;

//    try {
//       const problem = await Problem.findOne({ slug });

//       if (!problem) {
//          res.write(`data: ${JSON.stringify({ status: "Problem Not Found ❌" })}\n\n`);
//          return res.end();
//       }

//       // 🔥 SSE HEADERS
//       res.setHeader("Content-Type", "text/event-stream");
//       res.setHeader("Cache-Control", "no-cache");
//       res.setHeader("Connection", "keep-alive");
//       res.flushHeaders && res.flushHeaders(); // 🔥 important

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
//          send({ status: "Compilation Error ❌" });
//          return res.end();
//       }

//       let passed = 0;
//       const total = problem.testCases.length;

//       // ================= RUN =================
//       for (let i = 0; i < total; i++) {

//          const tc = problem.testCases[i];
//          const inputFile = path.join(tempDir, `input_${fileId}.txt`);
//          fs.writeFileSync(inputFile, tc.input);

//          let output;

//          try {
//             output = execSync(
//                `java -cp "${tempDir}" ${className} < "${inputFile}"`,
//                { timeout: 2000 }
//             ).toString();
//          } catch (err) {
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

//          // 🔥 IMPORTANT: delay (fix 0/80 issue)
//          await new Promise((r) => setTimeout(r, 40));

//          console.log("📤 Progress:", passed, "/", total);

//          // 🔥 LIVE PROGRESS
//          send({ type: "progress", passed, total });
//       }

//       // ✅ SUCCESS
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


 
 