// ================= VALIDATION =================
function validateUserCode(code, problem) {

   const functionName = problem?.functionName || "solve";
   const returnType = problem?.returnType || "int";
   const parameters = problem?.parameters || [];

   // ================= FUNCTION SIGNATURE EXTRACT =================
   const match = code.match(/public\s+(\w+(?:\[\])?)\s+(\w+)\s*\(([^)]*)\)/);

   if (!match) {
      return "Invalid function format ❌";
   }

   const userReturn = match[1];
   const userName = match[2];
   const userParamsRaw = match[3].trim();

   // ================= PARAM PARSE =================
   const userParams = userParamsRaw
      ? userParamsRaw.split(",").map(p => p.trim().split(" ")[0])
      : [];

   // ================= FUNCTION NAME =================
   if (userName !== functionName) {
      return `Function name must be ${functionName} ❌`;
   }

   // ================= RETURN TYPE =================
   if (userReturn !== returnType) {
      return `Return type must be ${returnType} ❌`;
   }

   // ================= PARAM COUNT =================
   if (userParams.length !== parameters.length) {
      return `Expected ${parameters.length} parameters but got ${userParams.length} ❌`;
   }

   // ================= PARAM TYPE =================
   for (let i = 0; i < userParams.length; i++) {
      if (userParams[i] !== parameters[i].type) {
         return `Parameter ${i + 1} must be ${parameters[i].type} ❌`;
      }
   }

   // ================= CLASS CHECK =================
   if (!/class\s+Solution/.test(code)) {
      return "Class Solution is required ❌";
   }

   // ================= RETURN CHECK =================
   if (!/return\s+/.test(code)) {
      return "Return statement required ❌";
   }

   return null;
}

// ================= INPUT PARSER =================
function generateInputParsing(parameters) {

   let inputParsing = "";
   let args = [];

   parameters.forEach((param, index) => {

      const { type, name } = param;

      // ---------- SINGLE VALUES ----------
      if (type === "int") {
         inputParsing += `int ${name} = sc.nextInt();\n`;
      }
      else if (type === "long") {
         inputParsing += `long ${name} = sc.nextLong();\n`;
      }
      else if (type === "double") {
         inputParsing += `double ${name} = sc.nextDouble();\n`;
      }
      else if (type === "boolean") {
         inputParsing += `boolean ${name} = sc.nextBoolean();\n`;
      }
      else if (type === "String") {
         inputParsing += `String ${name} = sc.next();\n`;
      }

      // ---------- ARRAYS ----------
      else if (type === "int[]") {
         inputParsing += `
int n${index} = sc.nextInt();
int[] ${name} = new int[n${index}];
for(int i=0;i<n${index};i++){
   ${name}[i] = sc.nextInt();
}
`;
      }
      else if (type === "long[]") {
         inputParsing += `
int n${index} = sc.nextInt();
long[] ${name} = new long[n${index}];
for(int i=0;i<n${index};i++){
   ${name}[i] = sc.nextLong();
}
`;
      }
      else if (type === "double[]") {
         inputParsing += `
int n${index} = sc.nextInt();
double[] ${name} = new double[n${index}];
for(int i=0;i<n${index};i++){
   ${name}[i] = sc.nextDouble();
}
`;
      }
      else if (type === "boolean[]") {
         inputParsing += `
int n${index} = sc.nextInt();
boolean[] ${name} = new boolean[n${index}];
for(int i=0;i<n${index};i++){
   ${name}[i] = sc.nextBoolean();
}
`;
      }
      else if (type === "String[]") {
         inputParsing += `
int n${index} = sc.nextInt();
String[] ${name} = new String[n${index}];
for(int i=0;i<n${index};i++){
   ${name}[i] = sc.next();
}
`;
      }

      args.push(name);
   });

   return { inputParsing, args };
}

// ================= WRAPPER =================
function generateJavaWrapper(code, problem, className = "Main") {

   const parameters = problem?.parameters || [];
   const functionName = problem?.functionName || "solve";

   const error = validateUserCode(code, problem);
   if (error) {
      return `public class ${className} {
         public static void main(String[] args) {
            System.out.println("${error}");
         }
      }`;
   }

   let userCode = code;

   // 🔥 BLOCK PRINT
   userCode = userCode.replace(/System\.out\.println/g, "// blocked");

   const { inputParsing, args } = generateInputParsing(parameters);

   return `
import java.util.*;

${userCode}

class ${className} {
   public static void main(String[] args) {

      Scanner sc = new Scanner(System.in);

      ${inputParsing}

      Solution sol = new Solution();

      Object result = sol.${functionName}(${args.join(", ")});

      // ---------- ARRAY OUTPUT ----------
      if(result instanceof int[]){
         int[] __res = (int[]) result;
         for(int i=0;i<__res.length;i++){
            System.out.print(__res[i]);
            if(i<__res.length-1) System.out.print(" ");
         }
         System.out.println();
      }
      else if(result instanceof long[]){
         long[] __res = (long[]) result;
         for(int i=0;i<__res.length;i++){
            System.out.print(__res[i]);
            if(i<__res.length-1) System.out.print(" ");
         }
         System.out.println();
      }
      else if(result instanceof double[]){
         double[] __res = (double[]) result;
         for(int i=0;i<__res.length;i++){
            System.out.print(__res[i]);
            if(i<__res.length-1) System.out.print(" ");
         }
         System.out.println();
      }
      else if(result instanceof boolean[]){
         boolean[] __res = (boolean[]) result;
         for(int i=0;i<__res.length;i++){
            System.out.print(__res[i]);
            if(i<__res.length-1) System.out.print(" ");
         }
         System.out.println();
      }
      else if(result instanceof String[]){
         String[] __res = (String[]) result;
         for(int i=0;i<__res.length;i++){
            System.out.print(__res[i]);
            if(i<__res.length-1) System.out.print(" ");
         }
         System.out.println();
      }

      // ---------- NORMAL OUTPUT ----------
      else{
         System.out.println(result);
      }
   }
}
`;
}

module.exports = generateJavaWrapper;






// // ================= VALIDATION =================
// function validateUserCode(code, problem) {

//    const functionName = problem?.functionName || "solve";
//    const returnType = problem?.returnType || "int";

//    // 🔥 ALLOW DEFAULT BOILERPLATE
//    const isBoilerplate =
//       code.includes("class Solution") &&
//       code.includes(functionName);

//    // ❌ Agar custom class likha (boilerplate ke alawa)
//    if (!isBoilerplate && /class\s+/i.test(code)) {
//       return "Do not write class ❌";
//    }

//    // ❌ Agar extra public method likha
//    if (!isBoilerplate && /public\s+/i.test(code)) {
//       return "Do not write full function ❌";
//    }

//    // 🔥 RETURN TYPE CHECK
//    const regex = new RegExp(`public\\s+(\\w+)\\s+${functionName}`);
//    const match = code.match(regex);

//    if (match) {
//       const userReturnType = match[1];

//       if (userReturnType !== returnType) {
//          return `Return type must be ${returnType} ❌`;
//       }
//    }

//    // ❌ no return
//    if (!code.includes("return")) {
//       return "Return statement required ❌";
//    }

//    // ❌ wrong type (basic)
//    if (returnType === "int" && /return\s+["']/.test(code)) {
//       return "Return type must be int ❌";
//    }

//    return null;
// }

// function generateJavaWrapper(code, problem, className = "Main") {

//    const parameters = problem?.parameters || [];
//    const returnType = problem?.returnType || "int";
//    const functionName = problem?.functionName || "solve";

//    // 🔥 VALIDATION FIRST
//    const error = validateUserCode(code, problem);
//    if (error) {
//       return `public class ${className} {
//          public static void main(String[] args) {
//             System.out.println("${error}");
//          }
//       }`;
//    }

//    let inputParsing = "";
//    let args = [];

//    // 🔥 USE FULL USER CODE (NO EXTRACTION)
//    let userCode = code;

//    // 🔥 BLOCK PRINT
//    userCode = userCode.replace(/System\.out\.println/g, "// blocked");

//    parameters.forEach((param, index) => {

//       if (param.type === "int") {
//          inputParsing += `int ${param.name} = sc.nextInt();\n`;
//          args.push(param.name);
//       }

//       else if (param.type === "int[]") {
//          inputParsing += `
// int n${index} = sc.nextInt();
// int[] ${param.name} = new int[n${index}];
// for(int i=0;i<n${index};i++){
//    ${param.name}[i] = sc.nextInt();
// }
// `;
//          args.push(param.name);
//       }
//    });

//    return `
// import java.util.*;

// ${userCode}

// class ${className} {
//    public static void main(String[] args) {

//       Scanner sc = new Scanner(System.in);

//       ${inputParsing}

//       Solution sol = new Solution();

//       Object result = sol.${functionName}(${args.join(", ")});

//       if(result instanceof int[]){
//          int[] resultArr = (int[]) result;
//          for(int i=0;i<resultArr.length;i++){
//             System.out.print(resultArr[i]);
//             if(i < resultArr.length-1) System.out.print(" ");
//          }
//          System.out.println();
//       }
//       else if(result instanceof long[]){
//          long[] resultArr = (long[]) result;
//          for(int i=0;i<resultArr.length;i++){
//             System.out.print(resultArr[i]);
//             if(i < resultArr.length-1) System.out.print(" ");
//          }
//          System.out.println();
//       }
//       else if(result instanceof double[]){
//          double[] resultArr = (double[]) result;
//          for(int i=0;i<resultArr.length;i++){
//             System.out.print(resultArr[i]);
//             if(i < resultArr.length-1) System.out.print(" ");
//          }
//          System.out.println();
//       }
//       else if(result instanceof boolean[]){
//          boolean[] resultArr = (boolean[]) result;
//          for(int i=0;i<resultArr.length;i++){
//             System.out.print(resultArr[i]);
//             if(i < resultArr.length-1) System.out.print(" ");
//          }
//          System.out.println();
//       }
//       else{
//          System.out.println(result);
//       }
//    }
// }
// `;
// }

// module.exports = generateJavaWrapper;



  