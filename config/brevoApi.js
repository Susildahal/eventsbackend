import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Send email using Brevo API (alternative to SMTP)
 * More reliable on Render as it uses HTTPS instead of SMTP ports
 */
export const sendEmailViaBrevoAPI = async (mailOptions) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Events Team",
          email: process.env.SMTP_EMAIL,
        },
        to: [
          {
            email: mailOptions.to,
            name: mailOptions.toName || "",
          },
        ],
        subject: mailOptions.subject,
        htmlContent: mailOptions.html || mailOptions.htmlContent,
        textContent: mailOptions.text || "",
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("✅ Email sent via Brevo API:", response.data);
    return {
      messageId: response.data.messageId,
      success: true,
    };
  } catch (error) {
    console.error("❌ Brevo API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export default sendEmailViaBrevoAPI;
