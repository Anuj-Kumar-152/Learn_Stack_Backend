const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
   },

   role: {
      type: String,
      enum: [
         "USER", "ADMIN", "EMPLOYEE"
      ],
      default: "USER"
   },

   email: {
      type: String,
      unique: true,
      required: true
   },
   isMFA: { type: Boolean, default: false },
   accessToken: { type: String },
   refreshToken: { type: String },
   password: {
      type: String,
      required: true
   },
   isVerified: { type: Boolean, default: false },   
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);












// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//    name: { type: String, required: true },

//    username: {
//       type: String,
//       unique: true,
//       required: true,
//       lowercase: true
//    },

//    email: {
//       type: String,
//       unique: true,
//       required: true
//    },

//    password: {
//       type: String,
//       required: true
//    },

//    bio: { type: String, default: "" },

//    college: { type: String, default: "" },

//    avatar: { type: String, default: "" },

//    github: { type: String, default: "" },
//    linkedin: { type: String, default: "" },
//    skills: { type: [String], default: [] },

//    isVerified: { type: Boolean, default: false },
//    otp: String,
//    otpExpiry: Date,
//    resendCount: { type: Number, default: 0 },

//    resetToken: String,
//    resetTokenExpiry: Date,

//    // 🔥 ADD THIS (MARKS SYSTEM)
//    score: { type: Number, default: 0 },

//    createdAt: {
//       type: Date,
//       default: Date.now
//    }
// });

// module.exports = mongoose.model("User", userSchema);


 