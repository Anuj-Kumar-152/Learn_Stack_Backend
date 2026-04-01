import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Brevo SMTP transporter (Render safe)
const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: Number(process.env.SMTP_PORT),
   secure: false,
   auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
   },
   tls: {
      rejectUnauthorized: false
   }
});

// send email function
export const sendEmail = async (to, subject, otp) => {
   try {
      if (!to) {
         throw new Error("Receiver email missing ❌");
      }

     

      const info = await transporter.sendMail({
         from: `"Code Platform" <kumaranuj7794@gmail.com>`, // ✅ FIX
         to,
         subject,
         text: `Your OTP is ${otp}`,
         html: `<h1>${otp}</h1>`
      });

      
      return true;

   } catch (error) {
      console.log("❌ EMAIL ERROR FULL:", error);
      return false;
   }
};