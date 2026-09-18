const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function verificationEmail(email, token) {
    try {
        const info = await transporter.sendMail({
            from: `"E-commerce2601" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Please Verify your Email",
            html: `<b>Verify your email <a href="http://localhost:5173/verify/${token}">Click Here</a></b>`,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

async function forgetPasswordEmail(email, token) {
    try {
        const info = await transporter.sendMail({
            from: `"E-commerce2601" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Reset Password",
            html: `<b>For Resetting Password <a href="http://localhost:5173/resetpassword/${token}">Click Here</a></b>`,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

module.exports = {
    verificationEmail,
    forgetPasswordEmail
};