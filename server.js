const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (if needed)
// app.use(express.static(path.join(__dirname, 'public')));

// Route to handle form submissions
app.post('/submit', (req, res) => {
    const { name, phoneNumber, email, subject, message } = req.body;

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });

    // Email content
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: process.env.CREATOR_EMAIL,
        subject: `New Contact Form Submission - ${subject}`,
        text: `
        Name: ${name}
        Phone Number: ${phoneNumber}
        Email: ${email}
        Message: ${message}
        `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});