function generateJavaBoilerplate(problem) {

   const functionName = problem?.functionName || "solve";
   const returnType = problem?.returnType || "int";
   const parameters = problem?.parameters || [];

   // 🔥 parameters string
   const paramString = parameters
      .map(p => `${p.type} ${p.name}`)
      .join(", ");

   return `class Solution {
    public ${returnType} ${functionName}(${paramString}) {
        // write your code here
    }
}`;
}

module.exports = generateJavaBoilerplate;