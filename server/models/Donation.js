const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bloodType: { type: String, required: true },
  location: { type: String, required: true },
  component: { type: String },
  units: { type: Number, default: 1 },
  smoker: { type: String, enum: ["Yes", "No"], default: "No" },
  diabetic: { type: String, enum: ["Yes", "No"], default: "No" },
  condition: { type: String, default: "None" },
  donationDate: { type: Date, default: Date.now }
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
