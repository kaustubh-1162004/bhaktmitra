

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', async (req, res) => {
    const { name, phone, email, subject, message } = req.body;

   
    const qrData = `Name: ${name}, Phone: ${phone}, Email: ${email}, Subject: ${subject}, Message: ${message}`;

    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // Send email with QR code
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CREATOR_EMAIL,
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        attachments: [
            {
                filename: 'qrcode.png',
                path: qrCodeUrl
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({ message: 'Form submitted successfully!' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});