require('dotenv').config();
const sendEmail = require('./src/utils/sendEmail');

const test = async () => {
    try {
        await sendEmail({
            email: 'jaykumar2dear@gmail.com',
            subject: 'Test Email from Gmail setup',
            message: 'This is a test email.'
        });
        console.log("Email sent successfully!");
    } catch (err) {
        console.error("Email failed:", err.message);
    }
};

test();
