import React, { useState } from "react";

const DonateForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    donor: user?._id || "",
    bloodType: user?.bloodType || "",
    location: user?.location || "",
    component: "",
    units: 1,
    smoker: "No",
    diabetic: "No",
    condition: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Donation submitted successfully!");
        setFormData({
          donor: user?._id || "",
          bloodType: "",
          location: "",
          component: "",
          units: 1,
          smoker: "No",
          diabetic: "No",
          condition: ""
        });

        const updatedUser = {
          ...user,
          litersDonated: (parseFloat(user.litersDonated || 0) + 0.45).toFixed(2),
          smoker: formData.smoker,
          diabetic: formData.diabetic,
          condition: formData.condition,
          bloodType: formData.bloodType,
          location: formData.location
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setMessage(`❌ Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setMessage("❌ Error submitting donation.");
    }
  };

  const karnatakaDistricts = [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan",
    "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal",
    "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga",
    "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir",
    "Vijayanagar"
  ];

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-xl font-bold text-red-700 mb-4">🩸 Donate Blood</h2>

      <div className="mb-4 text-sm">
        <p><strong>Donor:</strong> {user?.name} ({user?.email})</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Blood Type */}
        <div>
          <label className="block text-sm font-medium">Blood Type:</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Blood Type</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium">Location:</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Location</option>
            {karnatakaDistricts.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Component Type */}
        <div>
          <label className="block text-sm font-medium">Type of Donation / Component:</label>
          <select
            name="component"
            value={formData.component}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Component</option>
            {[
              "Whole Blood", "Plasma", "Platelets",
              "Single Donor Platelet (SDP)", "Single Donor Plasma (SDP)",
              "Packed Red Blood Cells (PRBC)", "Leukoreduced PRBC", "Irradiated PRBC",
              "Platelet Rich Plasma (PRP)", "Random Donor Platelet (RDP)",
              "Platelet Concentrate", "Fresh Frozen Plasma (FFP)",
              "Cryoprecipitate (Cryo)", "Cryo Poor Plasma"
            ].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Units */}
        <div>
          <label className="block text-sm font-medium">Units Donated:</label>
          <input
            type="number"
            name="units"
            value={formData.units}
            onChange={handleChange}
            min="1"
            max="3"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Smoking */}
        <div>
          <label className="block text-sm font-medium">Do you smoke?</label>
          <select
            name="smoker"
            value={formData.smoker}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Diabetic */}
        <div>
          <label className="block text-sm font-medium">Are you diabetic?</label>
          <select
            name="diabetic"
            value={formData.diabetic}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium">Any existing condition / symptoms?</label>
          <textarea
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded"
            placeholder="Optional (e.g. fever, allergy, etc.)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Submit Donation
        </button>
      </form>

      {message && (
        <p className={`mt-4 font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default DonateForm;
