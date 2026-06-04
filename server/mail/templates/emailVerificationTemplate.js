// Minimal transactional template. Keep OTP emails plain and text-heavy for
// better inbox placement with Gmail, Outlook, and Yahoo.
exports.otpTemplate = (otp) => {
  return `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your SkillBridge verification code</title>
  </head>
  <body style="margin:0;padding:24px;background:#ffffff;color:#111111;font-family:Arial,sans-serif;font-size:16px;line-height:1.5">
    <p>Your SkillBridge verification code is:</p>

    <p style="margin:20px 0;font-size:30px;font-weight:700;letter-spacing:4px;color:#111111">
      ${otp}
    </p>

    <p>This code expires in 5 minutes.</p>
    <p>If you did not request this code, you can ignore this email.</p>
    <p>SkillBridge</p>
  </body>
</html>
`;
};
