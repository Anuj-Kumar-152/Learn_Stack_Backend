const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
 
const { sendEmail } = require("../config/email");

// 🔥 username generator
// 🔥 username generator (IMPROVED)
const generateUsername = async (name) => {
   const base = name.toLowerCase().replace(/\s+/g, "");

   let username;
   let exists = true;

   while (exists) {
      // 🔥 random number (1000–9999)
      const number = Math.floor(1000 + Math.random() * 9000);

      // 🔥 random letters (2 chars)
      const chars = Math.random().toString(36).substring(2, 4);

      // 🔥 final username
      username = `${base}_${chars}${number}`;

      const user = await User.findOne({ username });
      if (!user) exists = false;
   }

   return username;
};
 
 

// exports.signup = async (req, res) => {
//    const { name, email, password } = req.body;

//    const exists = await User.findOne({ email });
//    if (exists) return res.status(400).json({ msg: "Email exists" });

//    const username = await generateUsername(name);
//    const hashed = await bcrypt.hash(password, 10);

//    // 🔥 OTP generate
//    const otp = Math.floor(100000 + Math.random() * 900000).toString();

//    const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       username,
//       otp,
//       otpExpiry: Date.now() + 1 * 60 * 1000,
//       isVerified: false,
//       resendCount: 0   // ✅ ADD THIS
//    });

//    await sendEmail(
//       email,
//       "OTP Verification",
//       otp
//    );

//    res.json({
//       msg: "OTP sent to email"
//    });
// };

exports.signup = async (req, res) => {
   const { name, email, password } = req.body;

   const existingUser = await User.findOne({ email });

   // 🔥 अगर user already exist है
   if (existingUser) {

      // ❌ अगर verified है → block
      if (existingUser.isVerified) {
         return res.status(400).json({ msg: "Email already registered ❌" });
      }

      // 🔥 अगर unverified है → update कर दो
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      existingUser.name = name;
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.username = await generateUsername(name);
      existingUser.otp = otp;
      existingUser.otpExpiry = Date.now() + 1 * 60 * 1000;
      existingUser.resendCount = 0;

      await existingUser.save();

      await sendEmail(
         email,
         "OTP Verification",
         otp
      );

      return res.json({
         msg: "OTP resent, please verify"
      });
   }

   // 🔥 नया user create
   const username = await generateUsername(name);
   const hashed = await bcrypt.hash(password, 10);

   const otp = Math.floor(100000 + Math.random() * 900000).toString();

   const user = await User.create({
      name,
      email,
      password: hashed,
      username,
      otp,
      otpExpiry: Date.now() + 1 * 60 * 1000,
      isVerified: false,
      resendCount: 0
   });

   await sendEmail(
      email,
      "OTP Verification",
      otp
   );

   res.json({
      msg: "OTP sent to email"
   });
};

exports.resendOtp = async (req, res) => {
   try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({ msg: "User not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = otp;
      user.otpExpiry = Date.now() + 1 * 60 * 1000; // 1 min

      await user.save();

      await sendEmail(
         email,
         "Resend OTP",
         otp
      );

      res.json({ msg: "OTP resent" });

   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
   }
};


// ✅ LOGIN (email OR username)
exports.login = async (req, res) => {
   const { identifier, password } = req.body;

   const user = await User.findOne({
      $or: [
         { email: identifier },
         { username: identifier }
      ]
   });

   if (!user) return res.status(400).json({ msg: "User not found" });

   const match = await bcrypt.compare(password, user.password);
   if (!match) return res.status(400).json({ msg: "Wrong password" });

   const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
   );

   res.json({ token, user });
};

// ✅ GET PROFILE
exports.getMe = async (req, res) => {
   const user = await User.findById(req.user.userId).select("-password");
   res.json(user);
};


// ✅ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
   try {
      const { name, bio, college, username, github, linkedin, skills } = req.body;

      // 🔥 validation
      if (!name || name.length < 2) {
         return res.status(400).json({ msg: "Name too short" });
      }

      // 🔥 username unique check
      if (username) {
         const existing = await User.findOne({ username });

         if (existing && existing._id.toString() !== req.user.userId) {
            return res.status(400).json({ msg: "Username already taken" });
         }
      }

      const user = await User.findByIdAndUpdate(
         req.user.userId,
         {
            name,
            bio,
            college,
            username,

            // 🔥 NEW FIELDS
            github,
            linkedin,
            skills
         },
         { new: true }
      ).select("-password");

      res.json(user);

   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
   }
};

// ✅ UPLOAD AVATAR
exports.uploadAvatar = async (req, res) => {

   if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
   }

   const filePath = `/uploads/${req.file.filename}`;

   const user = await User.findByIdAndUpdate(
      req.user.userId,
      { avatar: filePath },
      { returnDocument: "after" }
   );

   res.json(user);
};



// ✅ CHECK USERNAME AVAILABILITY
exports.checkUsername = async (req, res) => {
   try {
      const { username } = req.query;

      if (!username) {
         return res.status(400).json({ available: false });
      }

      const existing = await User.findOne({ username });

      if (existing) {
         return res.json({ available: false });
      }

      res.json({ available: true });

   } catch (err) {
      console.error(err);
      res.status(500).json({ available: false });
   }
};



// 🔥 FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
   try {
      const { identifier } = req.body;

      const user = await User.findOne({
         $or: [
            { email: identifier },
            { username: identifier }
         ]
      });

      if (!user) {
         return res.status(404).json({ msg: "User not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = otp;
      user.otpExpiry = Date.now() + 1 * 60 * 1000;

      await user.save();

      await sendEmail(
         user.email,
         "Password Reset OTP",
         otp
      );

      res.json({ msg: "OTP sent for password reset 📩" });

   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
   }
};

// 🔥 RESET PASSWORD
exports.resetPassword = async (req, res) => {
   try {
      const { email, otp, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({ msg: "User not found" });
      }

      if (user.otp !== otp || user.otpExpiry < Date.now()) {
         return res.status(400).json({ msg: "Invalid or expired OTP ❌" });
      }

      const hashed = await bcrypt.hash(password, 10);

      user.password = hashed;
      user.otp = undefined;
      user.otpExpiry = undefined;

      await user.save();

      res.json({ msg: "Password reset successful ✅" });

   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
   }
};


// extra
exports.verifyOtp = async (req, res) => {
   try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({ msg: "User not found" });
      }

      if (user.otp !== otp || user.otpExpiry < Date.now()) {
         return res.status(400).json({ msg: "Invalid or expired OTP" });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      user.resendCount = 0;   // ✅ RESET

      await user.save();

      const token = jwt.sign(
         { userId: user._id },
         process.env.JWT_SECRET,
         { expiresIn: "7d" }
      );

      res.json({ token, user });

   } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
   }
};







// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// // 🔥 username generator
// // 🔥 username generator (IMPROVED)
// const generateUsername = async (name) => {
//    const base = name.toLowerCase().replace(/\s+/g, "");

//    let username;
//    let exists = true;

//    while (exists) {
//       // 🔥 random number (1000–9999)
//       const number = Math.floor(1000 + Math.random() * 9000);

//       // 🔥 random letters (2 chars)
//       const chars = Math.random().toString(36).substring(2, 4);

//       // 🔥 final username
//       username = `${base}_${chars}${number}`;

//       const user = await User.findOne({ username });
//       if (!user) exists = false;
//    }

//    return username;
// };

// // ✅ SIGNUP
// // exports.signup = async (req, res) => {
// //    const { name, email, password } = req.body;

// //    const exists = await User.findOne({ email });
// //    if (exists) return res.status(400).json({ msg: "Email exists" });

// //    const username = await generateUsername(name);
// //    const hashed = await bcrypt.hash(password, 10);

// //    const user = await User.create({
// //       name,
// //       email,
// //       password: hashed,
// //       username
// //    });

// //    const token = jwt.sign(
// //       { userId: user._id },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "7d" }
// //    );

// //    res.json({ token, user });
// // };
// exports.signup = async (req, res) => {
//    const { name, email, password } = req.body;

//    const exists = await User.findOne({ email });
//    if (exists) return res.status(400).json({ msg: "Email exists" });

//    const username = await generateUsername(name);
//    const hashed = await bcrypt.hash(password, 10);

//    // 🔥 OTP generate
//    const otp = Math.floor(100000 + Math.random() * 900000).toString();

//    const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       username,
//       otp,
//       otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min
//       isVerified: false
//    });

//    // 🔥 अभी testing (later email भेजेंगे)
//    res.json({
//       msg: "OTP sent",
//       otp
//    });
// };


// // ✅ LOGIN (email OR username)
// exports.login = async (req, res) => {
//    const { identifier, password } = req.body;

//    const user = await User.findOne({
//       $or: [
//          { email: identifier },
//          { username: identifier }
//       ]
//    });

//    if (!user) return res.status(400).json({ msg: "User not found" });

//    const match = await bcrypt.compare(password, user.password);
//    if (!match) return res.status(400).json({ msg: "Wrong password" });

//    const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//    );

//    res.json({ token, user });
// };

// // ✅ GET PROFILE
// exports.getMe = async (req, res) => {
//    const user = await User.findById(req.user.userId).select("-password");
//    res.json(user);
// };

 
// // ✅ UPDATE PROFILE
// exports.updateProfile = async (req, res) => {
//    try {
//       const { name, bio, college, username, github, linkedin, skills } = req.body;

//       // 🔥 validation
//       if (!name || name.length < 2) {
//          return res.status(400).json({ msg: "Name too short" });
//       }

//       // 🔥 username unique check
//       if (username) {
//          const existing = await User.findOne({ username });

//          if (existing && existing._id.toString() !== req.user.userId) {
//             return res.status(400).json({ msg: "Username already taken" });
//          }
//       }

//       const user = await User.findByIdAndUpdate(
//          req.user.userId,
//          {
//             name,
//             bio,
//             college,
//             username,

//             // 🔥 NEW FIELDS
//             github,
//             linkedin,
//             skills
//          },
//          { new: true }
//       ).select("-password");

//       res.json(user);

//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ msg: "Server error" });
//    }
// };

// // ✅ UPLOAD AVATAR
// exports.uploadAvatar = async (req, res) => {

//    if (!req.file) {
//       return res.status(400).json({ msg: "No file uploaded" });
//    }

//    const filePath = `/uploads/${req.file.filename}`;

//    const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { avatar: filePath },
//       { returnDocument: "after" }
//    );

//    res.json(user);
// };



// // ✅ CHECK USERNAME AVAILABILITY
// exports.checkUsername = async (req, res) => {
//    try {
//       const { username } = req.query;

//       if (!username) {
//          return res.status(400).json({ available: false });
//       }

//       const existing = await User.findOne({ username });

//       if (existing) {
//          return res.json({ available: false });
//       }

//       res.json({ available: true });

//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ available: false });
//    }
// };



// // 🔥 FORGOT PASSWORD
// exports.forgotPassword = async (req, res) => {
//    try {
//       const { identifier } = req.body;

//       const user = await User.findOne({
//          $or: [
//             { email: identifier },
//             { username: identifier }
//          ]
//       });

//       if (!user) {
//          return res.status(404).json({ msg: "User not found" });
//       }

//       const token = crypto.randomBytes(32).toString("hex");

//       user.resetToken = token;
//       user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

//       await user.save();

//       res.json({
//          msg: "Reset token generated",
//          token
//       });

//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ msg: "Server error" });
//    }
// };

// // 🔥 RESET PASSWORD
// exports.resetPassword = async (req, res) => {
//    try {
//       const { token } = req.params;
//       const { password } = req.body;

//       const user = await User.findOne({
//          resetToken: token,
//          resetTokenExpiry: { $gt: Date.now() }
//       });

//       if (!user) {
//          return res.status(400).json({ msg: "Invalid or expired token" });
//       }

//       const hashed = await bcrypt.hash(password, 10);

//       user.password = hashed;
//       user.resetToken = undefined;
//       user.resetTokenExpiry = undefined;

//       await user.save();

//       res.json({ msg: "Password reset successful" });

//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ msg: "Server error" });
//    }
// };


// // extra
// exports.verifyOtp = async (req, res) => {
//    try {
//       const { email, otp } = req.body;

//       const user = await User.findOne({ email });

//       if (!user) {
//          return res.status(404).json({ msg: "User not found" });
//       }

//       if (user.otp !== otp || user.otpExpiry < Date.now()) {
//          return res.status(400).json({ msg: "Invalid or expired OTP" });
//       }

//       user.isVerified = true;
//       user.otp = undefined;
//       user.otpExpiry = undefined;

//       await user.save();

//       const token = jwt.sign(
//          { userId: user._id },
//          process.env.JWT_SECRET,
//          { expiresIn: "7d" }
//       );

//       res.json({ token, user });

//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ msg: "Server error" });
//    }
// };