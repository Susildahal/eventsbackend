import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST || "smtp-relay.brevo.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
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
    console.error("⚠️ SMTP Connection Error:", error && error.message ? error.message : error);
    console.error("Check: 1) SMTP_HOST/PORT 2) SMTP_USER/SMTP_PASS 3) Sender email verification");
    console.error("SMTP config:", { host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER ? '***SET***' : '❌ MISSING' });
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

export default transporter;
