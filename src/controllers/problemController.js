const Problem = require("../models/Problem");
const slugify = require("slugify"); 
const generateBoilerplate = require("../utils/generateBoilerplate");

// GET ALL
const getProblems = async (req, res) => {
   try {
      const problems = await Problem.find().sort({ createdAt: -1 });
      res.json(problems);
   } catch (err) {
      res.status(500).json({ msg: err.message });
   }
};

// GET ONE
const getProblemBySlug = async (req, res) => {
   try {
      const problem = await Problem.findOne({ slug: req.params.slug });

      if (!problem) {
         return res.status(404).json({ msg: "Problem not found" });
      }

      res.json(problem);
   } catch (err) {
      res.status(500).json({ msg: err.message });
   }
};

// CREATE
const createProblem = async (req, res) => {
   try {
      const { title, difficulty } = req.body;

      if (!title || !difficulty) {
         return res.status(400).json({ msg: "Title & Difficulty required" });
      }

      const slug = slugify(title, { lower: true });

      const exists = await Problem.findOne({ slug });
      if (exists) {
         return res.status(400).json({ msg: "Problem already exists" });
      }

      const problem = await Problem.create({
         ...req.body,
         slug
      });

      res.status(201).json(problem);

   } catch (err) {
      res.status(500).json({ msg: err.message });
   }
};


 
const getProblemBoilerplate = async (req, res) => {

   const { slug } = req.params;

   try {
      const problem = await Problem.findOne({ slug });

      if (!problem) {
         return res.json({ error: "Problem not found ❌" });
      }

      // 🔥 SAFE GENERATION
      const boilerplate = generateBoilerplate(problem);

      return res.json({ boilerplate });

   } catch (err) {
      console.log("🔥 ERROR:", err);   // 👉 IMPORTANT
      return res.json({ error: err.message }); // 👉 REAL ERROR दिखाओ
   }
};

 

 

module.exports = { getProblems, getProblemBySlug, createProblem, getProblemBoilerplate };