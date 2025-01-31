require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend requests

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post("/send-message", async (req, res) => {
  const { name, phone, service, address } = req.body;
  const message = `New Inquiry:
  Name: ${name}
  Phone: ${phone}
  Service: ${service}
  Address: ${address}`;

  try {
    const response = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+918455975766",
      body: message,
    });

    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
