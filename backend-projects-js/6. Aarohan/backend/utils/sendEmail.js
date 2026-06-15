import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {
      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to,

      subject,

      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email Error:", error);

    throw error;
  }
};

export default sendEmail;
