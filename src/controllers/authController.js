const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateOTP, setOTP, verifyOTP } = require('../services/otpService');
const sendEmail = require('../utils/sendEmail');

// Generate Access Token (15 minutes)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_change_me', {
        expiresIn: '15m',
    });
};

// Generate Refresh Token (7 days)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
        expiresIn: '7d',
    });
};

exports.register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            const otp = generateOTP();
            setOTP(user.email, otp);

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'LearnStack - Verify Your Account',
                    message: `Welcome to LearnStack! Your account verification OTP is: ${otp}\nIt is valid for 5 minutes.`
                });
            } catch (err) {
                console.error('Email could not be sent', err);
            }

            return res.status(200).json({
                success: true,
                message: 'Account not verified. OTP sent to email.',
                requireVerification: true,
                requireMFA: false,
                email: user.email
            });
        }

        if (user.isMFA) {
            // Generate OTP
            const otp = generateOTP();
            setOTP(user.email, otp);

            // Send OTP via Email
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'LearnStack - Your Login OTP',
                    message: `Your OTP for login is: ${otp}\nIt is valid for 5 minutes.`
                });
            } catch (err) {
                console.error('Email could not be sent', err);
            }

            return res.status(200).json({
                success: true,
                message: 'OTP sent to email. Please verify to complete login.',
                requireVerification: false,
                requireMFA: true,
                email: user.email
            });
        }

        // MFA is Disabled -> Instant Login
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            requireMFA: false,
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const isValid = verifyOTP(email, otp);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If the user was verifying their account, mark them as verified
        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleMFA = async (req, res) => {
    try {
        const { isMFA } = req.body;

        if (typeof isMFA !== 'boolean') {
            return res.status(400).json({ success: false, message: 'isMFA must be a boolean' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isMFA = isMFA;
        await user.save();

        res.status(200).json({
            success: true,
            message: `MFA has been ${isMFA ? 'enabled' : 'disabled'} successfully`,
            isMFA: user.isMFA
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = generateOTP();
        setOTP(user.email, otp);

        const subject = !user.isVerified ? 'LearnStack - Verify Your Account (Resend)' : 'LearnStack - Your Login OTP (Resend)';
        const message = !user.isVerified
            ? `Welcome to LearnStack! Your account verification OTP is: ${otp}\nIt is valid for 5 minutes.`
            : `Your OTP for login is: ${otp}\nIt is valid for 5 minutes.`;

        await sendEmail({ email: user.email, subject, message });

        res.status(200).json({ success: true, message: 'OTP resent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Current User Endpoint
exports.getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Refresh Token Endpoint
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token is required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.accessToken = newAccessToken;
        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            token: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};