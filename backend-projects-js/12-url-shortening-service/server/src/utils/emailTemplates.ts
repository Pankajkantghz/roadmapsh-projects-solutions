// src/utils/emailTemplates.ts

interface BaseEmailOptions {
  title: string;
  preheader?: string;
  bodyText: string;
  otpCode?: string;
  actionButton?: {
    text: string;
    url: string;
  };
  footerNote?: string;
}

export const renderRoyalEmailTemplate = ({
  title,
  bodyText,
  otpCode,
  actionButton,
  footerNote = "If you did not request this email, please ignore it safely.",
}: BaseEmailOptions): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0813; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0813; padding: 40px 12px;">
    <tr>
      <td align="center">
        <!-- Main Royal Container Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #15102a; border-radius: 16px; border: 1px solid #2d1f4e; overflow: hidden; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);">
          
          <!-- Brand Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #4c1d95 0%, #2e1065 100%); padding: 32px; text-align: center; border-bottom: 1px solid #3b0764;">
              <div style="font-size: 22px; font-weight: 800; color: #f3e8ff; letter-spacing: 0.5px; text-transform: uppercase;">
                ⚡ Darth Shortener
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #c084fc; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">
                Royal Security System
              </div>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: left;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                ${title}
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 24px; color: #cbd5e1;">
                ${bodyText}
              </p>
            </td>
          </tr>

          <!-- Optional OTP Code Display -->
          ${
            otpCode
              ? `
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: #20163d; border: 1px dashed #7e22ce; border-radius: 12px; padding: 20px; text-align: center;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #c084fc; display: inline-block; margin-left: 10px;">
                  ${otpCode}
                </span>
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Optional Action Button -->
          ${
            actionButton
              ? `
          <tr>
            <td style="padding: 10px 32px 28px 32px; text-align: center;">
              <a href="${actionButton.url}" target="_blank" style="background: linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: 700; border-radius: 8px; display: inline-block; box-shadow: 0 4px 14px rgba(126, 34, 206, 0.4);">
                ${actionButton.text}
              </a>
              <p style="margin-top: 16px; font-size: 12px; color: #94a3b8; word-break: break-all;">
                If the button doesn't work, copy and paste this link:<br>
                <a href="${actionButton.url}" style="color: #a855f7; text-decoration: underline;">${actionButton.url}</a>
              </p>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Security Note -->
          <tr>
            <td style="padding: 0 32px 28px 32px; text-align: left;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #818cf8;">
                ${footerNote}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top: 1px solid #231645;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0f0b21; text-align: center; font-size: 11px; color: #64748b;">
              © ${new Date().getFullYear()} Darth Shortener Inc. All rights reserved.
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