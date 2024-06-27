const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const app = express();

app.use(bodyParser.json());

// Endpoint to handle form submission
app.post('/submit', async (req, res) => {
    const { name, age, address } = req.body;
    const data = `Name: ${name}, Age: ${age}, Address: ${address}`;

    try {
        // Generate QR code
        const qrCodeDataURL = await QRCode.toDataURL(data);

        // Send email with QR code
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // use environment variables for security
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // send email to your own address
            subject: 'Lost Person Details',
            html: `<p>Details for a lost person:</p>
                   <p>${data}</p>
                   <img src="${qrCodeDataURL}"/>`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Details submitted successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});