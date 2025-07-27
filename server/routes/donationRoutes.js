const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");

// POST: Submit a new donation
router.post("/", async (req, res) => {
  const { donor, bloodType, location, component, units } = req.body;
  try {
    const donation = new Donation({ donor, bloodType, location, component, units });
    await donation.save();
    res.status(201).json({ message: "Donation submitted successfully", donation });
  } catch (err) {
    res.status(500).json({ message: "Error submitting donation", error: err.message });
  }
});

// GET: All donations (optional donor filter)
router.get("/", async (req, res) => {
  try {
    const donorId = req.query.donor;
    const filter = donorId ? { donor: donorId } : {};
    const donations = await Donation.find(filter).populate("donor", "name email");
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
});

// GET: Search by bloodType, location, component, unitsRequired
router.get("/search", async (req, res) => {
  try {
    const { bloodType, location, component, unitsRequired } = req.query;
    const filter = {};
    if (bloodType) filter.bloodType = bloodType;
    if (location) filter.location = new RegExp(location, "i");
    if (component) filter.component = component;
    if (unitsRequired) filter.units = { $gte: parseInt(unitsRequired) };

    const donations = await Donation.find(filter).populate("donor", "name email");
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error searching donations", error });
  }
});

// GET: Seed Dummy Donations
router.get("/test/seed-donors", async (req, res) => {
  try {
    const sample = [
      {
        donor: "664e2f2b6fc9ef51f0c3f3a2",
        bloodType: "O+",
        location: "Chikkamagaluru",
        component: "Random Donor Platelet (RDP)",
        units: 2,
      },
      {
        donor: "68625b92a78dbd0cd56c11cf",
        bloodType: "A+",
        location: "Mandya",
        component: "Whole Blood",
        units: 1,
      },
      {
        donor: "686376344c6c588d9f3dd310",
        bloodType: "B+",
        location: "Mysuru",
        component: "Single Donor Platelet (SDP)",
        units: 3,
      },
    ];

    const result = await Donation.insertMany(sample);
    res.status(200).json({
      message: "✅ Dummy donations seeded successfully!",
      insertedCount: result.length,
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to seed data", error: err.message });
  }
});

module.exports = router;
