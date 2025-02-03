

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


// Log when the server starts
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

app.get("/abc", (req, res) => {
  console.log("📩 Received request at /abc");
  res.send("Backend is running successfully!");
});

app.post("/send-message", async (req, res) => {
  console.log("📩 Received request at /send-message", req.body);
  const { name, phone, service, address } = req.body;
  const message = `New Inquiry:\nName: ${name}\nPhone: ${phone}\nService: ${service}\nAddress: ${address}`;

  try {
    const response = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+918455975766",
      body: message,
    });

    console.log("✅ Twilio Message Sent:", response.sid);
    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error("❌ Twilio Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
