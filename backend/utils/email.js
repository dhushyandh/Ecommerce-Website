const nodemailer = require('nodemailer');
const sendEmail = async options => {
    const transport = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }

    };

    const transporter = nodemailer.createTransport(transport);

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    const info = await transporter.sendMail(message)

    try {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) console.log('[email.js] Preview URL:', previewUrl);
    } catch (err) {
        // ignore preview URL errors
    }
}
module.exports = sendEmail;