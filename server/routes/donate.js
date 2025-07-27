const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");

// 🔍 SEARCH ROUTE
router.get("/search", async (req, res) => {
  try {
    const { bloodType, location, component } = req.query;

    const query = {
      ...(bloodType && { bloodType }),
      ...(location && { location }),
      ...(component && { component }),
    };

    const donations = await Donation.find(query).populate("donor", "name email");
    res.status(200).json(donations);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ⚠️ SEED DUMMY DATA FOR TESTING
router.get("/test/seed-donors", async (req, res) => {
  try {
    const sample = [
      {
        donor: "64a1f9e1b7c3a2f0e0d12345", // Replace with real _id from users
        bloodType: "B+",
        location: "Mandya",
        component: "Packed Red Blood Cells",
        units: 2
      },
      {
        donor: "64a1f9e1b7c3a2f0e0d67890", // Replace with another real _id
        bloodType: "A+",
        location: "Bangalore",
        component: "Whole Blood",
        units: 1
      }
    ];

    await Donation.insertMany(sample);
    res.send("✅ Dummy donations seeded");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to seed data");
  }
});

module.exports = router;
