const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        object: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS}
});

const sendMail = (to, subject, text) => {
    transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text
    });
}

module.exports = sendMail;