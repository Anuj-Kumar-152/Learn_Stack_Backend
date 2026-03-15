 const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const runCodeController = async (req, res) => {

   let { code, input } = req.body;

   try {

      const tempDir = path.join(__dirname, "../../temp");

      if (!fs.existsSync(tempDir)) {
         fs.mkdirSync(tempDir);
      }

      // Smart wrapper
      if (!code.includes("class")) {

         code = `
public class Main {
   public static void main(String[] args) {

${ code }

   }
}
`;

      }

      // Detect class name
      const match = code.match(/public\s+class\s+(\w+)/);
      const className = match ? match[1] : "Main";

      const fileName = `${ className }.java`;
      const filePath = path.join(tempDir, fileName);

      fs.writeFileSync(filePath, code);

      // 🧾 Save input in file
      const inputFile = path.join(tempDir, "input.txt");
      fs.writeFileSync(inputFile, input || "");

      // Compile + run
      const command =
         `javac ${filePath} && java -cp ${tempDir} ${className} < ${inputFile}`;

      exec(command, (error, stdout, stderr) => {

         const classFile = path.join(tempDir, `${ className }.class`);

         try {

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
            if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);

         } catch (cleanupError) {

            console.error("Cleanup error:", cleanupError);

         }

         if (error) {
            return res.json({
               output: stderr || "Error running code"
            });
         }

         res.json({
            output: stdout || "No Output"
         });

      });

   } catch (err) {

      res.status(500).json({
         output: "Server error"
      });

   }

};

module.exports = runCodeController;













// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const runCodeController = async (req, res) => {

//    let { code, input } = req.body;

//    try {

//       const tempDir = path.join(__dirname, "../../temp");

//       if (!fs.existsSync(tempDir)) {
//          fs.mkdirSync(tempDir);
//       }

//       // 🧠 Smart wrapper
//       if (!code.includes("class")) {

//          code = `
// public class Main {
//    public static void main(String[] args) {

// ${code}

//    }
// }
// `;

//       }

//       // Detect class name
//       const match = code.match(/public\s+class\s+(\w+)/);
//       const className = match ? match[1] : "Main";

//       const fileName = `${className}.java`;
//       const filePath = path.join(tempDir, fileName);

//       fs.writeFileSync(filePath, code);

//       const command =
//          `docker run --rm --cpus="0.5" --memory="128m" -v "${tempDir}:/app" eclipse-temurin:17 bash -c "timeout 5 javac /app/${fileName} && echo '${input || ""}' | timeout 5 java -cp /app ${className}"`;

//       exec(command, (error, stdout, stderr) => {

//          const classFile = path.join(tempDir, `${className}.class`);

//          try {

//             if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//             if (fs.existsSync(classFile)) fs.unlinkSync(classFile);

//          } catch (cleanupError) {

//             console.error("Cleanup error:", cleanupError);

//          }

//          if (error) {
//             return res.json({
//                output: stderr || "Error running code"
//             });
//          }

//          res.json({
//             output: stdout || "No Output"
//          });

//       });

//    } catch (err) {

//       res.status(500).json({
//          output: "Server error"
//       });

//    }

// };

// module.exports = runCodeController;









// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const runCodeController = async (req, res) => {

//    const { code } = req.body;

//    try {

//       const tempDir = path.join(__dirname, "../../temp");

//       if (!fs.existsSync(tempDir)) {
//          fs.mkdirSync(tempDir);
//       }

//       // Detect class name
//       const match = code.match(/public\s+class\s+(\w+)/);
//       const className = match ? match[1] : "Main";

//       const fileName = `${className}.java`;
//       const filePath = path.join(tempDir, fileName);

//       // Save Java code
//       fs.writeFileSync(filePath, code);

//       // const command =
//       //    `docker run --rm -v "${tempDir}:/app" eclipse-temurin:17 bash -c "javac /app/${fileName} && java -cp /app ${className}"`;
//       const command =
//          `docker run --rm --cpus="0.5" --memory="128m" -v "${tempDir}:/app" eclipse-temurin:17 bash -c "timeout 5 javac /app/${fileName} && timeout 5 java -cp /app ${className}"`;

//       exec(command, (error, stdout, stderr) => {

//          const classFile = path.join(tempDir, `${className}.class`);

//          // 🧹 Cleanup temp files
//          try {

//             if (fs.existsSync(filePath)) {
//                fs.unlinkSync(filePath);
//             }

//             if (fs.existsSync(classFile)) {
//                fs.unlinkSync(classFile);
//             }

//          } catch (cleanupError) {
//             console.error("Cleanup error:", cleanupError);
//          }

//          if (error) {
//             return res.json({
//                output: stderr || "Error running code"
//             });
//          }

//          res.json({
//             output: stdout || "No Output"
//          });

//       });

//    } catch (err) {

//       res.status(500).json({
//          output: "Server error"
//       });

//    }

// };

// module.exports = runCodeController;



