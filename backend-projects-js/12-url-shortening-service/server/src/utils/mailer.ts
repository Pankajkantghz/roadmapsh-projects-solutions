import { BrevoClient } from "@getbrevo/brevo";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: EmailPayload): Promise<void> {
  // 🟢 Pass the configuration properties explicitly using the correct apiKey object property name
  const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY || "",
  });

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      sender: {
        name: process.env.SENDER_NAME || "Darth Shortener",
        email: process.env.SENDER_EMAIL || "no-reply@darthurl.com", // ◄── Double check this matches your Brevo verified sender dashboard!
      },
      to: [{ email: to }],
    });
  } catch (error) {
    throw new Error(
      `Brevo mail delivery framework encountered a fault: ${(error as Error).message}`,
    );
  }
}
