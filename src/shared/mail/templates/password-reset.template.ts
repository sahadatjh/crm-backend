export const getPasswordResetTemplate = (name: string, resetLink: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f6f8fb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f8fb;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);">

           
              <tr>
                <td style="padding:24px 48px 32px 48px;">
                  <h2 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#111827;text-align:center;">Reset Your Password</h2>
                  <p style="margin:0 0 24px 0;font-size:14px;color:#6b7280;text-align:center;">This link expires in 1 hour</p>

                  <p style="margin:0 0 8px 0;font-size:15px;color:#374151;">Hi <strong>${name}</strong>,</p>
                  <p style="margin:0 0 28px 0;font-size:15px;color:#374151;line-height:1.7;">We received a request to reset the password for your account. Click the button below to choose a new password.</p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom:28px;">
                        <a href="${resetLink}"
                          style="display:inline-block;padding:13px 36px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.2px;">
                          Reset Password →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 24px 0;">

                  <p style="margin:0 0 6px 0;font-size:13px;color:#9ca3af;">If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
                  <p style="margin:0;font-size:13px;color:#9ca3af;">If the button doesn't work, paste this link into your browser:</p>
                  <p style="margin:8px 0 0 0;font-size:12px;word-break:break-all;">
                    <a href="${resetLink}" style="color:#4f46e5;text-decoration:none;">${resetLink}</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 48px;background-color:#f9fafb;border-top:1px solid #f0f0f0;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} FBINTBD CRM. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
