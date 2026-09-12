const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
    host: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


async function verificationEmail(email) {
    try {
        const info = await transporter.sendMail({
            from: '"E-commerce2601" litonmia.dev.bd@gmail.com',
            to: email,
            subject: "Please Verify your Email",
            html: "<b>verify your email: click here</b>",
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}