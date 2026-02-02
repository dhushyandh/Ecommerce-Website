const nodemailer = require('nodemailer');
const createTransporter = () => {
    const provider = (process.env.EMAIL_PROVIDER || '').toLowerCase();
    const service = (process.env.SMTP_SERVICE || '').toLowerCase();

    // Gmail via App Password (recommended for simple deployments like Render)
    if (provider === 'gmail' || service === 'gmail') {
        const user = process.env.GMAIL_USER || process.env.SMTP_USER;
        const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

        if (!user || !pass) {
            throw new Error('Gmail email is enabled but GMAIL_USER and GMAIL_APP_PASSWORD are not set');
        }

        return nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });
    }

    // Generic SMTP (SendGrid/Mailgun/Zoho/etc)
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = typeof process.env.SMTP_SECURE !== 'undefined'
        ? String(process.env.SMTP_SECURE).toLowerCase() === 'true'
        : port === 465;

    if (!host || !port || !user || !pass) {
        throw new Error('SMTP email is enabled but SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS are not fully set');
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });
};

const sendEmail = async (options) => {
    const transporter = createTransporter();

    const fromName = process.env.SMTP_FROM_NAME || 'VIP Store';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || process.env.SMTP_USER;
    if (!fromEmail) {
        throw new Error('Missing FROM email: set SMTP_FROM_EMAIL (or GMAIL_USER/SMTP_USER)');
    }

    const message = {
        from: `${fromName} <${fromEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    try {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) console.log('[email.js] Preview URL:', previewUrl);
    } catch (err) {
        // ignore preview URL errors
    }

    return info;
};
module.exports = sendEmail;