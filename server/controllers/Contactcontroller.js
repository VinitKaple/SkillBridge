import twilio from "twilio";

/**
 * POST /api/contact/send
 * Receives { name, email, message } from the contact form
 * and forwards it as an SMS to the site owner's number.
 */
export const handleContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const smsBody =
      `SkillBridge Contact Form\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Message: ${message}`;

    const result = await client.messages.create({
      body: smsBody,
      from: process.env.TWILIO_PHONE_NUMBER,   // your Twilio number
      to: process.env.OWNER_PHONE_NUMBER,       // your personal number (add to .env)
    });

    console.log("Contact SMS sent, SID:", result.sid);

    return res.status(200).json({
      success: true,
      message: "Message received and forwarded successfully.",
    });
  } catch (error) {
    console.error("Contact form SMS error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send message.",
    });
  }
};