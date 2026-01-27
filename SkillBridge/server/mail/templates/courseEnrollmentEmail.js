// mail/templates/courseEnrollmentEmail.js

exports.courseEnrollmentEmail = (courseName, name) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Course Registration Confirmation</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
      /* Reset */
      body, p, h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0;
      }

      body {
        background-color: #f5f7fb;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333333;
      }

      .wrapper {
        width: 100%;
        padding: 30px 10px;
        box-sizing: border-box;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 24px 20px 28px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        text-align: left;
        box-sizing: border-box;
      }

      .logo-wrap {
        text-align: center;
        margin-bottom: 16px;
      }

      .logo {
        max-width: 200px;
        height: auto;
        display: inline-block;
      }

      .message {
        font-size: 20px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 20px;
        color: #111827;
      }

      .content {
        font-size: 16px;
        color: #4b5563;
      }

      .content p {
        margin-bottom: 14px;
      }

      .highlight {
        font-weight: 700;
        color: #111827;
      }

      .cta-wrap {
        text-align: center;
        margin-top: 26px;
        margin-bottom: 6px;
      }

      .cta {
        display: inline-block;
        padding: 11px 28px;
        background-color: #ffd60a;
        color: #111827 !important;
        text-decoration: none;
        border-radius: 999px;
        font-size: 16px;
        font-weight: 700;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .cta:hover {
        filter: brightness(0.97);
      }

      .support {
        font-size: 13px;
        color: #9ca3af;
        margin-top: 22px;
        text-align: center;
      }

      .divider {
        margin: 18px 0;
        border-top: 1px solid #e5e7eb;
      }

      .footer {
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
        margin-top: 18px;
      }

      @media (max-width: 480px) {
        .container {
          padding: 18px 14px 22px;
        }

        .message {
          font-size: 18px;
        }

        .cta {
          width: 100%;
        }
      }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <div class="container">
        <div class="logo-wrap">
          <a href="https://skillBridge-edtech-project.vercel.app" target="_blank" rel="noopener noreferrer">
            <img
              class="logo"
              src="https://i.ibb.co/7Xyl________" 
              alt="SkillBridge Logo"
            />
          </a>
        </div>

        <div class="message">Course Registration Confirmation</div>

        <div class="content">
          <p>Dear <span class="highlight">${name}</span>,</p>

          <p>
            You have successfully registered for the course
            <span class="highlight">${courseName}</span>.
          </p>

          <p>
            We’re excited to have you as a learner! You can now access the course
            content, track your progress, and complete assignments directly from
            your dashboard.
          </p>

          <p>
            If this wasn’t you or you believe this email was sent by mistake,
            please contact us immediately.
          </p>

          <div class="cta-wrap">
            <a
              class="cta"
              href="https://skillBridge-edtech-project.vercel.app/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Dashboard
            </a>
          </div>

          <div class="divider"></div>

          <p class="support">
            Need help? Just reply to this email or reach us at
            <span class="highlight">support@skillBridge.com</span>.
          </p>
        </div>
      </div>

      <p class="footer">
        You are receiving this email because you signed up for a course on
        SkillBridge. If you didn’t create this account, you can safely ignore
        this email.
      </p>
    </div>
  </body>
</html>`;
};
