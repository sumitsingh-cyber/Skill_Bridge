// mail/templates/emailVerificationTemplate.js

exports.otpTemplate = (otp, name = "User") => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Verify Your Email | SkillBridge</title>

      <style>
        body {
          background-color: #ffffff;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
          text-align: center;
        }

        .logo {
          max-width: 180px;
          margin-bottom: 24px;
        }

        .message {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 18px;
          color: #111827;
        }

        .body {
          font-size: 16px;
          margin-bottom: 24px;
        }

        .support {
          font-size: 14px;
          color: #6b7280;
          margin-top: 30px;
        }

        .highlight {
          font-weight: bold;
          color: #4f46e5;
          font-size: 24px;
          letter-spacing: 2px;
          margin: 16px 0;
          display: inline-block;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <a href="https://skillbridge.vercel.app">
          <img
            class="logo"
            src="https://i.ibb.co/7Xyj3PC/logo.png"
            alt="SkillBridge Logo"
          />
        </a>

        <div class="message">Verify Your Email Address</div>

        <div class="body">
          <p>Hello <strong>${name}</strong>, 👋</p>

          <p>
            Welcome to <strong>SkillBridge</strong> — your gateway to building
            real-world skills and advancing your career.
            To get started, please verify your email address using the
            <strong>One-Time Password (OTP)</strong> below.
          </p>

          <p class="highlight">${otp}</p>

          <p>
            This OTP is valid for <strong>5 minutes</strong>.
            For your security, please do not share this code with anyone.
            If you didn’t request this verification, you can safely ignore this email.
          </p>

          <p>
            Once verified, you’ll unlock full access to SkillBridge and start
            exploring courses designed to help you grow, learn, and succeed.
          </p>
        </div>

        <div class="support">
          Need help? Contact us at
          <a href="mailto:support@skillbridge.com">support@skillbridge.com</a>.
          <br />
          We’re here to help — every step of the way 🚀
        </div>
      </div>
    </body>
  </html>
  `;
};
