 
const fs = require("fs");
const path = require("path");

const cleanupTemp = () => {

   const tempDir = path.join(__dirname, "../../temp");

   if (!fs.existsSync(tempDir)) {
      return;
   }

   const files = fs.readdirSync(tempDir);

   files.forEach(file => {

      const filePath = path.join(tempDir, file);

      try {
         fs.unlinkSync(filePath);
      } catch (err) {
         console.error("Failed to delete:", filePath);
      }

   });

   console.log("Temp folder cleaned");

};

module.exports = cleanupTemp;

