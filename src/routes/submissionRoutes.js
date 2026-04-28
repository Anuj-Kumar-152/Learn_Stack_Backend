const express = require("express");
const router = express.Router();

const { getSubmissions } = require("../controllers/submissionController");

router.get("/submissions/:slug", getSubmissions);

module.exports = router;