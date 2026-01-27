// mail/templates/passwordUpdate.js

exports.passwordUpdated = (email, name) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Update Confirmation</title>

      <style>
        body {
          background-color: #ffffff;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #333333;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }

        .logo {
          max-width: 180px;
          margin-bottom: 20px;
        }

        .message {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .body {
          font-size: 16px;
          margin-bottom: 20px;
        }

        .support {
          font-size: 14px;
          color: #999999;
          margin-top: 25px;
        }

        .highlight {
          font-weight: bold;
          color: #0070f3;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <a href="https://skillbrige-edtech-project.vercel.app">
          <img
            class="logo"
            src="https://i.ibb.co/7Xyj3PC/logo.png"
            alt="SkillBridge Logo"
          />
        </a>

        <div class="message">Password Update Confirmation</div>

        <div class="body">
          <p>Hey <span class="highlight">${name}</span>,</p>

          <p>Your password has been successfully updated for the email:
            <span class="highlight">${email}</span>
          </p>

          <p>If you did not request this password change, please contact us immediately to secure your account.</p>
        </div>

        <div class="support">
          If you have any questions or need assistance, please reach us at:
          <a href="mailto:info@SkillBridge.com">info@SkillBridge.com</a><br />
          We are here to help!
        </div>
      </div>
    </body>
  </html>
  `;
};
