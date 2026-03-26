const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 🔥 GET USER BY USERNAME
router.get("/:username", async (req, res) => {
   try {
      const user = await User.findOne({
         username: req.params.username
      }).select("-password");

      if (!user) {
         return res.status(404).json({ msg: "User not found" });
      }

      res.json(user);

   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
   }
});

module.exports = router; // ✅ IMPORTANT