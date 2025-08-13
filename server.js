const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the new 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// In a real application, you would use a database to store OTPs.
// For this example, we'll use a simple in-memory object.
const otpStore = {};

// Create a Nodemailer transporter using your Gmail account
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ajha57089@gmail.com', // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD  // Your App Password
  }
});

// Route to handle sending the OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp; // Store the OTP with the email

  const mailOptions = {
    from: 'ajha57089@gmail.com',
    to: email,
    subject: 'Your Mievo Technologies Login OTP',
    html: `<p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p><p>This is valid for 5 minutes.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP email.' });
  }
});

// Route to handle verifying the OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  // Check if the OTP matches the one stored
  if (otpStore[email] && otpStore[email] === otp) {
    // Correct OTP, clear it from the store for security
    delete otpStore[email];
    res.status(200).json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid OTP.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});