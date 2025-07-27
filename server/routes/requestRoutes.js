const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// 📌 POST: Submit a request via /api/request/send
router.post("/send", async (req, res) => {
  const { recipientId, bloodType, location, senderId } = req.body;

  if (!recipientId || !bloodType || !location || !senderId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const request = new Request({
      recipient: recipientId,
      sender: senderId,
      bloodType,
      location,
    });

    await request.save();

    // ✅ Emit event to notify donor in real-time
    const io = req.app.get("io");
    io?.emit("new-request", {
      bloodType,
      location,
      recipientId: String(recipientId),
      senderId: String(senderId),
      message: `🚨 Blood required: ${bloodType} in ${location}.`,
    });

    res.status(201).json({ message: "Request sent successfully", request });
  } catch (error) {
    console.error("❌ Error saving request:", error);
    res.status(500).json({ message: "Error sending request", error });
  }
});

// 📌 GET: All requests (with optional recipient filter)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.recipient) filter.recipient = req.query.recipient;

    const requests = await Request.find(filter)
      .populate("recipient", "name email")
      .populate("sender", "name email");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
});

// 📌 GET: Requests sent by a specific user (sender)
router.get("/mine/:senderId", async (req, res) => {
  try {
    const requests = await Request.find({ sender: req.params.senderId })
      .populate("recipient", "name email");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user requests", error });
  }
});

module.exports = router;
