import React, { useState } from "react";

const RequestForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    recipient: user?.name || "",
    bloodType: user?.bloodType || "",
    location: user?.location || "",
    component: "",
    urgency: "Normal",
    contact: user?.phone || "",
    hospital: "",
    reason: ""
  });

  const [message, setMessage] = useState("");

  const districts = [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
    "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
    "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Blood request submitted successfully!");
        setFormData({
          recipient: user?.name || "",
          bloodType: "",
          location: "",
          component: "",
          urgency: "Normal",
          contact: user?.phone || "",
          hospital: "",
          reason: ""
        });
      } else {
        setMessage(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Error submitting request.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold text-red-700 text-center mb-6">📥 Blood Request Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient */}
        <input
          type="text"
          name="recipient"
          value={formData.recipient}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />

        {/* Blood Type */}
        <select
          name="bloodType"
          value={formData.bloodType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Blood Type --</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>

        {/* Location */}
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select District --</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Component */}
        <select
          name="component"
          value={formData.component}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Component --</option>
          {[
            "Whole Blood", "Plasma", "Platelets", "Packed Red Blood Cells (PRBC)",
            "Fresh Frozen Plasma (FFP)", "Cryoprecipitate", "Random Donor Platelet (RDP)"
          ].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Urgency */}
        <select
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
          <option value="Emergency">Emergency</option>
        </select>

        {/* Hospital */}
        <input
          type="text"
          name="hospital"
          placeholder="Hospital / Clinic Name"
          value={formData.hospital}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Contact */}
        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Reason */}
        <textarea
          name="reason"
          placeholder="Reason (e.g., surgery, accident, etc.)"
          value={formData.reason}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border rounded"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Submit Request
        </button>
      </form>

      {message && (
        <p className={`mt-4 font-medium text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RequestForm;
