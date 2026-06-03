export const baseEmailTemplate = (title, subtitle, content) => {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background:#f5f5f5;
    padding:40px 20px;
  ">

    <div style="
      max-width:600px;
      margin:auto;
      background:#ffffff;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 4px 20px rgba(0,0,0,0.08);
    ">

      <div style="
        background:#111827;
        color:white;
        text-align:center;
        padding:30px;
      ">
        <h1 style="
          margin:0;
          font-size:32px;
        ">
          Aarohan
        </h1>

        <p style="
          margin-top:8px;
          color:#d1d5db;
        ">
          ${subtitle}
        </p>
      </div>

      <div style="
        padding:40px 30px;
        color:#374151;
      ">
        <h2 style="
          margin-top:0;
          color:#111827;
        ">
          ${title}
        </h2>

        ${content}
      </div>

      <div style="
        background:#f9fafb;
        text-align:center;
        padding:20px;
        color:#9ca3af;
        font-size:14px;
      ">
        © 2026 Aarohan.
        All rights reserved.
      </div>

    </div>
  </div>
  `;
};

export const verificationEmailTemplate = (otp) =>
  baseEmailTemplate(
    "Verify Your Email",
    "Welcome to Aarohan",
    `
      <p>
        Thank you for joining Aarohan.
      </p>

      <p>
        Please verify your account
        using the OTP below:
      </p>

      <div style="
        text-align:center;
        margin:35px 0;
      ">
        <div style="
          display:inline-block;
          background:#111827;
          color:white;
          padding:18px 36px;
          font-size:32px;
          letter-spacing:8px;
          border-radius:10px;
          font-weight:bold;
        ">
          ${otp}
        </div>
      </div>

      <p>
        This OTP expires in
        <strong>5 minutes</strong>.
      </p>
      `,
  );

export const forgotPasswordTemplate = (otp) =>
  baseEmailTemplate(
    "Password Reset OTP",
    "Reset Your Password",
    `
      <p>
        We received a request
        to reset your password.
      </p>

      <p>
        Use this OTP:
      </p>

      <div style="
        text-align:center;
        margin:35px 0;
      ">
        <div style="
          display:inline-block;
          background:#111827;
          color:white;
          padding:18px 36px;
          font-size:32px;
          letter-spacing:8px;
          border-radius:10px;
          font-weight:bold;
        ">
          ${otp}
        </div>
      </div>

      <p>
        OTP expires in
        <strong>5 minutes</strong>.
      </p>
      `,
  );

export const unlockOTPTemplate = (otp) =>
  baseEmailTemplate(
    "Security Alert",
    "Account Protection",
    `
      <p>
        Multiple failed login
        attempts were detected.
      </p>

      <p>
        Your account is
        temporarily locked.
      </p>

      <p>
        Verify using OTP:
      </p>

      <div style="
        text-align:center;
        margin:35px 0;
      ">
        <div style="
          display:inline-block;
          background:#111827;
          color:white;
          padding:18px 36px;
          font-size:32px;
          letter-spacing:8px;
          border-radius:10px;
          font-weight:bold;
        ">
          ${otp}
        </div>
      </div>

      <p>
        OTP expires in
        <strong>5 minutes</strong>.
      </p>
      `,
  );
