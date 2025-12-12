import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465, // Use port 465 instead of 587 for Render
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
});

// Verify transporter configuration (with error handling)
transporter.verify(function (error, success) {
  if (error) {
    console.error("⚠️ SMTP Connection Error:", error.message);
    console.error("Check: 1) Brevo credentials 2) Sender verified 3) Render env vars");
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

export default transporter;
