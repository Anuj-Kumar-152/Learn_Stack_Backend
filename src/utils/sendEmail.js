const nodemailer = require("nodemailer");
require('dotenv').config();
const sendEmail = async (options) => {
    console.log("---- SEND EMAIL DEBUG ----");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_USER:", process.env.SMTP_USER ? "Loaded" : "Missing");
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Loaded" : "Missing");

    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"LearnStack" <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
