# Microsoft Account Recovery Phishing Page

![Microsoft Logo](https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31)

## Overview
This project implements a Microsoft account recovery phishing page that mimics the official Microsoft account recovery flow. It includes email verification, code verification, and password reset steps.

## Features
- 🔒 Four-step verification process
- 📧 Real-time email verification code sending
- 💾 MongoDB data storage
- 🎨 Pixel-perfect Microsoft UI clone
- 📱 Responsive design
- 🔄 Real-time validation

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account (for sending verification codes)
- Git (optional)

## Installation

1. **Clone the Repository**
```bash
git clone <repository-url>
cd Microsoftreset
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
MONGODB_URI=your-mongodb-connection-string
```

4. **Start the Server**
```bash
node server.js
```

5. **Access the Application**
- Open your browser and navigate to:
  - http://localhost:8000 (Node.js server)
  - OR http://127.0.0.1:5500/index.html (Live Server)

## Project Structure
```
Microsoftreset/
├── index.html          # Main frontend file
├── styles.css          # Styling
├── script.js          # Frontend logic
├── server.js          # Backend server
├── models/
│   └── User.js        # MongoDB model
├── .env               # Environment variables
└── package.json       # Dependencies
```

## Troubleshooting Guide

### Email Sending Issues
1. **Gmail Authentication Failed**
   - Ensure your Gmail app password is correct
   - Enable "Less secure app access" or use App Password
   - Check your Gmail account for security alerts

   ![Gmail App Password](https://i.imgur.com/example1.png)

2. **Verification Code Not Received**
   - Check spam folder
   - Verify email address format
   - Check server logs for errors

### MongoDB Connection Issues
1. **Authentication Failed**
   - Verify MongoDB URI format:
     ```
     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
     ```
   - Check username and password
   - Ensure IP whitelist includes your address

   ![MongoDB Atlas](https://i.imgur.com/example2.png)

2. **Connection Timeout**
   - Check internet connection
   - Verify MongoDB cluster is running
   - Check firewall settings

### Server Issues
1. **Port Already in Use**
   - Kill existing Node.js processes:
     ```bash
     # Windows
     taskkill /F /IM node.exe
     ```
   - Change port in server.js
   - Check for other applications using port 8000

2. **Module Not Found**
   - Run `npm install` again
   - Check package.json for missing dependencies
   - Delete node_modules and reinstall

## Security Features
- Password hashing
- Email verification
- Session management
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

## Captured Data
View captured credentials at:
- MongoDB Atlas Dashboard
- http://localhost:8000/get-credentials

## Best Practices
1. Always use environment variables
2. Keep dependencies updated
3. Monitor server logs
4. Regularly backup database
5. Use secure connections (HTTPS)

## Common Error Messages and Solutions

| Error | Solution |
|-------|----------|
| "Failed to send verification code" | Check email credentials in .env |
| "MongoDB connection error" | Verify MongoDB URI and network access |
| "Port already in use" | Kill existing Node.js processes |
| "Module not found" | Reinstall dependencies |

## Support
For issues and support:
1. Check troubleshooting guide
2. Review server logs
3. Check MongoDB Atlas dashboard
4. Verify email settings

## Disclaimer
This project is for educational purposes only. Use responsibly and ethically.
