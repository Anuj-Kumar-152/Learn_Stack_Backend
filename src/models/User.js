const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },

   username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
   },

   email: {
      type: String,
      unique: true,
      required: true
   },

   password: {
      type: String,
      required: true
   },

   bio: { type: String, default: "" },

   college: { type: String, default: "" },

   avatar: { type: String, default: "" },

   // 🔥 NEW FIELDS (already added)
   github: { type: String, default: "" },
   linkedin: { type: String, default: "" },
   skills: { type: [String], default: [] },

   // 🔥 ADD THESE (OTP VERIFICATION)
   isVerified: { type: Boolean, default: false },
   otp: String,
   otpExpiry: Date,
   resendCount: { type: Number, default: 0 },

   // 🔥 FORGOT PASSWORD
   resetToken: String,
   resetTokenExpiry: Date,

   createdAt: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model("User", userSchema);


