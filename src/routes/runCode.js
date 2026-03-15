const express = require("express");
const router = express.Router();

const runCodeController = require("../controllers/runCodeController");

router.post("/run", runCodeController);

module.exports = router;