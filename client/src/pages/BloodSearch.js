import React, { useState, useEffect } from "react";
import axios from "axios";

const BloodSearch = () => {
  const [form, setForm] = useState({
    bloodType: "",
    component: "",
    location: "",
    unitsRequired: ""
  });
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { bloodType, component, location } = form;
      const res = await axios.get("http://localhost:5000/api/donation/search", {
        params: { bloodType, component, location },
      });
      const filtered = form.unitsRequired
        ? res.data.filter(d => d.units >= parseInt(form.unitsRequired))
        : res.data;
      setResults(filtered);
      setMessage(filtered.length === 0 ? "❌ No matching donors found." : "");
    } catch (err) {
      setMessage("❌ Error fetching donors.");
    }
  };

  const handleSendRequest = async (donorId) => {
  try {
    if (!userId) return alert("❌ You must be logged in to send requests.");

    await axios.post("http://localhost:5000/api/request/send", {
      senderId: userId,           // ✅ key changed
      recipientId: donorId,       // ✅ key changed
      bloodType: form.bloodType,
      location: form.location,
    });

    alert("✅ Request sent to donor successfully!");
  } catch (err) {
    console.error("Error sending request:", err.response?.data || err.message);
    alert("❌ Failed to send request.");
  }
};


  return (
    <div className="p-8 bg-white bg-opacity-90 rounded shadow-lg max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        🔍 Search Blood Donors (e-RaktKosh Style)
      </h2>

      <form onSubmit={handleSearch} className="grid sm:grid-cols-4 gap-4 mb-4">
        <select name="bloodType" value={form.bloodType} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Blood Type</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bt => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>

        <select name="component" value={form.component} onChange={handleChange} className="p-2 border rounded">
          <option value="">Component Type</option>
          {[
            "Whole Blood", "Plasma", "Platelets",
            "Single Donor Platelet (SDP)", "Single Donor Plasma (SDP)",
            "Packed Red Blood Cells (PRBC)", "Leukoreduced PRBC", "Irradiated PRBC",
            "Platelet Rich Plasma (PRP)", "Random Donor Platelet (RDP)",
            "Platelet Concentrate", "Fresh Frozen Plasma (FFP)",
            "Cryoprecipitate (Cryo)", "Cryo Poor Plasma"
          ].map(comp => (
            <option key={comp} value={comp}>{comp}</option>
          ))}
        </select>

        <select name="location" value={form.location} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Select District</option>
          {[
            "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
            "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga",
            "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
            "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
            "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
          ].map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <input
          type="number"
          name="unitsRequired"
          placeholder="Units Needed"
          min="1"
          value={form.unitsRequired}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <div className="sm:col-span-4">
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
            Search
          </button>
        </div>
      </form>

      {message && <p className="text-red-500 font-medium text-center mb-4">{message}</p>}

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="py-2 px-4 border">Donor Name</th>
                <th className="py-2 px-4 border">Blood Type</th>
                <th className="py-2 px-4 border">Component</th>
                <th className="py-2 px-4 border">Units</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Contact</th>
              </tr>
            </thead>
            <tbody>
              {results.map((d) => (
                <tr key={d._id} className="hover:bg-red-50">
                  <td className="py-2 px-4 border">{d.donor?.name || "N/A"}</td>
                  <td className="py-2 px-4 border">{d.bloodType}</td>
                  <td className="py-2 px-4 border">{d.component || "N/A"}</td>
                  <td className="py-2 px-4 border">{d.units || 1}</td>
                  <td className="py-2 px-4 border">{d.location}</td>
                  <td className="py-2 px-4 border">
                    <a href={`mailto:${d.donor?.email}`} className="text-blue-600 underline">
                      {d.donor?.email || "N/A"}
                    </a>
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleSendRequest(d.donor?._id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Send Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BloodSearch;
