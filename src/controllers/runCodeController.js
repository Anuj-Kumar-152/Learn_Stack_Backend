const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const Problem = require("../models/Problem");
const generateWrapper = require("../utils/generateWrapper");

const runCodeController = async (req, res) => {
   let { code, input, slug } = req.body;

   try {
      const tempDir = path.join(__dirname, "../../temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

      const fileId = Date.now();
      const className = `Main_${fileId}`;

      // 🔥 FETCH PROBLEM
      const problem = await Problem.findOne({ slug });

      if (!problem) {
         return res.json({ output: "Problem not found" });
      }

      // 🔥 WRAPPER
      const finalCode = generateWrapper(code, problem, className);
      console.log("🔥 WRAPPER CALLED");

      const filePath = path.join(tempDir, `${className}.java`);
      const inputFile = path.join(tempDir, `input_${fileId}.txt`);

      fs.writeFileSync(filePath, finalCode);
      fs.writeFileSync(inputFile, input || "");

      const command = `javac "${filePath}" && java -cp "${tempDir}" ${className} < "${inputFile}"`;

      exec(command, (error, stdout, stderr) => {

         try {
            fs.unlinkSync(filePath);
            fs.unlinkSync(path.join(tempDir, `${className}.class`));
            fs.unlinkSync(inputFile);
         } catch { }

         if (error) {
            console.log("❌ ERROR:", error.message);

            return res.json({
               input,
               output: (stderr || error.message)
                  .split("\n")
                  .slice(0, 5)
                  .join("\n"),
               expected: null
            });
         }

         const output = (stdout || "No Output").trim();

         // ================= 🔥 DEBUG LOGS =================
         console.log("🧪 RAW INPUT:", JSON.stringify(input));
         console.log("🧪 RAW OUTPUT:", JSON.stringify(output));
         console.log("🧪 EXAMPLES:", problem.examples);

         // ================= 🔥 NORMALIZE =================
         const normalize = (str) =>
            (str || "")
               .replace(/\r/g, "")
               .replace(/\n/g, " ")
               .replace(/\s+/g, " ")
               .trim();

         const userInput = normalize(input);

         console.log("🧪 NORMALIZED INPUT:", userInput);

         // ================= 🔥 MATCH =================
         let expected = null;

         let matchedExample = null;

         for (let ex of problem.examples || []) {
            const exInput = normalize(ex.input);

            console.log("🔍 CHECKING:", exInput, "==", userInput);

            if (exInput === userInput) {
               matchedExample = ex;
               break;
            }
         }

         if (matchedExample) {
            expected = normalize(matchedExample.output);
            console.log("✅ MATCH FOUND:", expected);
         } else {
            console.log("❌ NO MATCH FOUND");
         }

         // ================= RESPONSE =================
         res.json({
            input,
            output,
            expected
         });
      });

   } catch (err) {
      console.log("🔥 SERVER ERROR:", err);
      res.json({ output: "Server error" });
   }
};

module.exports = runCodeController;






// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");
// const Problem = require("../models/Problem");
// const generateWrapper = require("../utils/generateWrapper");

// const runCodeController = async (req, res) => {
//    let { code, input, slug } = req.body;
  

//    try {
//       const tempDir = path.join(__dirname, "../../temp");
//       if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

//       const fileId = Date.now();
//       const className = `Main_${fileId}`;

//       // 🔥 FETCH PROBLEM
//       const problem = await Problem.findOne({ slug });

//       if (!problem) {
//          return res.json({ output: "Problem not found" });
//       }

//       // 🔥 WRAPPER
//       const finalCode = generateWrapper(code, problem, className);
//       console.log("🔥 WRAPPER CALLED", finalCode);

//       const filePath = path.join(tempDir, `${className}.java`);
//       const inputFile = path.join(tempDir, `input_${fileId}.txt`);

//       fs.writeFileSync(filePath, finalCode);
//       fs.writeFileSync(inputFile, input || "");

//       const command = `javac "${filePath}" && java -cp "${tempDir}" ${className} < "${inputFile}"`;

//       exec(command, (error, stdout, stderr) => {

//          try {
//             fs.unlinkSync(filePath);
//             fs.unlinkSync(path.join(tempDir, `${className}.class`));
//             fs.unlinkSync(inputFile);
//          } catch { }

//          if (error) {
//             return res.json({
//                output: (stderr || error.message)
//                   .split("\n")
//                   .slice(0, 5)
//                   .join("\n")
//             });
//          }

//          res.json({
//             output: (stdout || "No Output").trim()
//          });
//       });

//    } catch {
//       res.json({ output: "Server error" });
//    }
// };

// module.exports = runCodeController;




 