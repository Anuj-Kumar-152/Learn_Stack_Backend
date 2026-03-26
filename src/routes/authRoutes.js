const express = require("express");
const router = express.Router();

const {
   signup,
   login,
   getMe,
   updateProfile,
   uploadAvatar,
   checkUsername,
   forgotPassword,
   resetPassword,
   verifyOtp,   // ✅ ADDED
   resendOtp
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

// ✅ AUTH
router.post("/signup", signup);
router.post("/login", login);

// 🔥 OTP VERIFY (ADDED)
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// ✅ NEW (username check)
router.get("/check-username", checkUsername);

// 🔥 FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ✅ USER
router.get("/me", auth, getMe);
router.put("/update", auth, updateProfile);

// ✅ AVATAR
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);

module.exports = router;









// const express = require("express");
// const router = express.Router();

// const {
//    signup,
//    login,
//    getMe,
//    updateProfile,
//    uploadAvatar,
//    checkUsername,
//    forgotPassword,     // ✅ added
//    resetPassword       // ✅ added
// } = require("../controllers/authController");

// const auth = require("../middleware/authMiddleware");
// const upload = require("../utils/upload");

// // ✅ AUTH
// router.post("/signup", signup);
// router.post("/login", login);

// // ✅ NEW (username check)
// router.get("/check-username", checkUsername);

// // 🔥 FORGOT PASSWORD
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// // ✅ USER
// router.get("/me", auth, getMe);
// router.put("/update", auth, updateProfile);

// // ✅ AVATAR
// router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);

// module.exports = router;


 


 