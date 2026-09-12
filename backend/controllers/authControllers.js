const User = require('../models/userSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



exports.registrationController = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, terms } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }
        if (!fullName || !email || !password || !confirmPassword || !terms) {
            return res.status(400).json({
                success: false,
                message: "Please fill the all field"
            })
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            })
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            })
        }
        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password not match"
            })
        }

        const hash = bcrypt.hashSync(password, 10);


        const user = new User({
            fullName: fullName,
            email: email,
            password: hash,
            terms: terms
        })

        await user.save()

        const verificationToken = jwt.sign({
            _id: user._id,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '1d' });

        res.status(201).json({
            success: true,
            message: "Registration Successfull"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }

}