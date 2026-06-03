
import express
from "express";

import dotenv
from "dotenv";

dotenv.config();

import sendEmail
from "./utils/sendEmail.js";

app.get(
  "/test-email",

  async (
    req,

    res,
  ) => {
    await sendEmail(
      "your_email@gmail.com",

      "Test Email",

      "<h1>Resend works</h1>",
    );

    res.json({
      success: true,
    });
  },
);
