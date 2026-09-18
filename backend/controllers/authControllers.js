const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verificationEmail, forgetPasswordEmail } = require('../utils/emailSender');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.registrationController = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, terms } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        if (!fullName || !email || !password || !confirmPassword || !terms) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = new User({
            fullName,
            email,
            password: hash,
            terms
        });

        await user.save();

        const verificationToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        await verificationEmail(email, verificationToken);

        return res.status(201).json({
            success: true,
            message: "Registration successful"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const passwordsMatch = bcrypt.compareSync(
            password,
            existingUser.password
        );

        if (!passwordsMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const accessToken = jwt.sign(
            {
                _id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                _id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                role: existingUser.role
            },
            accessToken
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.verifyEmailController = async (req, res) => {
    try {
        const { token } = req.params;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findByIdAndUpdate(
            decoded._id,
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            success: false,
            message: "Invalid or expired verification token"
        });
    }
};

exports.forgetPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const resetPasswordToken = jwt.sign(
            {
                _id: existingUser._id,
                email: existingUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        await forgetPasswordEmail(email, resetPasswordToken);

        return res.status(200).json({
            success: true,
            message: "Please check your email for resetting password"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};