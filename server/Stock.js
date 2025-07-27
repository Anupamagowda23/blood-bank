const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  bloodType: { type: String, required: true },
  units: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Stock", stockSchema);
