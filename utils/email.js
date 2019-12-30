const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // host: 'smtp.mailtrap.io',
        // port: 2525,
        // auth: {
        //     user: '5b313e78f43165',
        //     pass: 'c58f8b2f3b5c25'
        // }

        // Activate in gmail "less secure app" option
    });
    // 2. Define the email options
    const mailOptions = {
        from: 'Viet Tran <viet@viet.fi>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    };
    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
