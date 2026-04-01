const express = require("express");
const {
   getProblems,
   getProblemBySlug,
   createProblem,
   getProblemBoilerplate
} = require("../controllers/problemController");

const router = express.Router();

// 🔥 FIRST specific route
router.get("/boilerplate/:slug", getProblemBoilerplate);

// 🔥 THEN generic route
router.get("/:slug", getProblemBySlug);

router.get("/", getProblems);
router.post("/", createProblem);

module.exports = router;








// const express = require("express");
// const {
//    getProblems,
//    getProblemBySlug,
//    createProblem,
//    getProblemBoilerplate
// } = require("../controllers/problemController");

// const router = express.Router();

// router.get("/", getProblems);
// router.get("/:slug", getProblemBySlug);
// router.post("/", createProblem);
// router.get("/boilerplate/:slug", getProblemBoilerplate);

// module.exports = router;