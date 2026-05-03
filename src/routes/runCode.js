const express = require("express");
const router = express.Router();

// 🔥 IMPORTANT: correct import
const runCodeController = require("../controllers/runCodeController");
const submitCodeController = require("../controllers/submitCodeController");
const { protect } = require("../middleware/authMiddleware");

// ✅ NO () here
router.post("/run", protect, runCodeController);
router.get("/submit", protect, submitCodeController);

module.exports = router;


// const express = require("express");
// const router = express.Router();

// const runCodeController = require("../controllers/runCodeController");

// router.post("/run", runCodeController);

// module.exports = router;
