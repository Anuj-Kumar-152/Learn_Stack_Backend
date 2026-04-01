const express = require("express");
const router = express.Router();

// 🔥 IMPORTANT: correct import
const runCodeController = require("../controllers/runCodeController");
const submitCodeController = require("../controllers/submitCodeController");

// ✅ NO () here
router.post("/run", runCodeController);
router.get("/submit", submitCodeController);

module.exports = router;


// const express = require("express");
// const router = express.Router();

// const runCodeController = require("../controllers/runCodeController");

// router.post("/run", runCodeController);

// module.exports = router;