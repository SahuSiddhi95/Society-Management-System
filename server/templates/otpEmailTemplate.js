const otpEmailTemplate = (name, otp) => {
  return `
// <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Verify Your Email</title>
{/* <!--[if mso]> */}
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>                  
{/* <![endif]--> */}
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  {/* <!-- Preheader (hidden preview text) --> */}
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#f1f5f9;">
    Your SocietyOS verification code is inside. It expires in 10 minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9; padding:32px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%; background-color:#ffffff; border-radius:16px; border:1px solid #f1f5f9; box-shadow:0 8px 24px rgba(15,23,42,0.06); overflow:hidden;">

          {/* <!-- Logo / Brand header --> */}
          <tr>
            <td align="center" style="padding:36px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#4f46e5; width:40px; height:40px; border-radius:12px; text-align:center; vertical-align:middle;" width="40" height="40">
                    <span style="font-size:20px; line-height:40px; color:#ffffff;">🛡️</span>
                  </td>
                  <td style="padding-left:10px; font-family:Segoe UI, Arial, Helvetica, sans-serif; font-size:20px; font-weight:700; color:#1e293b; vertical-align:middle;">
                    SocietyOS
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {/* <!-- Divider --> */}
          <tr>
            <td style="padding:20px 40px 0 40px;">
              <div style="border-top:1px solid #f1f5f9; font-size:0; line-height:0;">&nbsp;</div>
            </td>
          </tr>

          {/* <!-- Title --> */}
          <tr>
            <td align="center" style="padding:28px 40px 0 40px; font-family:Segoe UI, Arial, Helvetica, sans-serif;">
              <div style="font-size:15px; font-weight:700; letter-spacing:0.3px; color:#4f46e5; text-transform:uppercase; margin-bottom:10px;">
                🔐 Verify Your Email
              </div>
              <h1 style="margin:0; font-size:22px; line-height:30px; font-weight:700; color:#0f172a;">
                Hi Siddhi,
              </h1>
            </td>
          </tr>

          {/* <!-- Body copy --> */}
          <tr>
            <td align="center" style="padding:14px 40px 0 40px; font-family:Segoe UI, Arial, Helvetica, sans-serif;">
              <p style="margin:0; font-size:15px; line-height:24px; color:#475569;">
                We received a request to reset your password. Use the one-time password below to continue.
              </p>
            </td>
          </tr>

          {/* <!-- OTP box --> */}
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px; font-family:Segoe UI, Arial, Helvetica, sans-serif;">
              <div style="font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#94a3b8; margin-bottom:12px;">
                Your One-Time Password (OTP)
              </div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#eef2ff; border:2px solid #c7d2fe; border-radius:12px; padding:16px 32px;">
                    <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:700; letter-spacing:10px; color:#4338ca;">
                      483921
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0 0; font-size:13px; line-height:20px; color:#94a3b8;">
                This OTP is valid for <strong style="color:#64748b;">10 minutes</strong>.
              </p>
            </td>
          </tr>

          {/* <!-- Security note --> */}
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; border:1px solid #f1f5f9; border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px; font-family:Segoe UI, Arial, Helvetica, sans-serif; font-size:13px; line-height:20px; color:#64748b;">
                    ⓘ&nbsp;&nbsp;If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {/* <!-- Sign-off --> */}
          <tr>
            <td style="padding:28px 40px 36px 40px; font-family:Segoe UI, Arial, Helvetica, sans-serif;">
              <p style="margin:0; font-size:14px; line-height:22px; color:#475569;">
                Thanks,<br />
                <strong style="color:#1e293b;">The SocietyOS Team</strong>
              </p>
            </td>
          </tr>

        </table>

        {/* <!-- Footer --> */}
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%; margin-top:20px;">
          <tr>
            <td align="center" style="font-family:Segoe UI, Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#94a3b8; padding:0 24px;">
              This is an automated message from SocietyOS. Please don't reply directly to this email.<br />
              &copy; 2026 SocietyOS. All rights reserved.
            </td>
          </tr> 
        </table>
        
      </td>
    </tr>
  </table>  

</body>
</html>`    }

module.exports = otpEmailTemplate;