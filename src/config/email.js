import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// transporter setup
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
   }
});

// send email function
export const sendEmail = async (to, subject, otp) => {
   try {
      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to,
         subject,
         html: `
         <div style="font-family: Arial; padding: 20px;">
            <h2 style="color: #4f46e5;">OTP Verification</h2>
            <p>Your OTP is:</p>
            <h1 style="letter-spacing: 5px;">${otp}</h1>
            <p>This OTP will expire in 1 minute ⏳</p>
         </div>
         `
      });
   } catch (error) {
      console.log(error);
   }
};