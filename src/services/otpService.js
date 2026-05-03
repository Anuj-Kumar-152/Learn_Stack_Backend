const myCache = require('../config/cache');

/**
 * Generate a 6-digit OTP
 * @returns {string} OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP in cache for a given email
 * @param {string} email 
 * @param {string} otp 
 */
const setOTP = (email, otp) => {
    // Stores OTP with the default TTL (5 minutes)
    myCache.set(`otp_${email}`, otp);
};

/**
 * Verify OTP for a given email
 * @param {string} email 
 * @param {string} otp 
 * @returns {boolean} true if valid, false otherwise
 */
const verifyOTP = (email, otp) => {
    const cachedOtp = myCache.get(`otp_${email}`);
    if (cachedOtp && cachedOtp === otp) {
        // Clear OTP after successful verification so it can't be reused
        myCache.del(`otp_${email}`);
        return true;
    }
    return false;
};

module.exports = {
    generateOTP,
    setOTP,
    verifyOTP
};
