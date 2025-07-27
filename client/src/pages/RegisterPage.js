import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    bloodType: "",
    age: "",
    weight: "",
    hemoglobin: "",
    gender: "",
    lastDonationDate: "",
    diabetic: "No",
    condition: "",
    role: "donor",
    consent: false,
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      setMsg("❌ Please agree to the terms before registering.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setMsg("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMsg("❌ Registration failed. Please check your inputs.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">🩸 Register to Blood Bank</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm">
        <input name="name" placeholder="Full Name" onChange={handleChange} required className="p-2 border rounded" />
        <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required className="p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="p-2 border rounded" />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required className="p-2 border rounded" />

        <select name="location" onChange={handleChange} required className="p-2 border rounded">
          <option value="">Select District</option>
          {[
            "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar",
            "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada",
            "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
            "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru",
            "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
          ].map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select name="bloodType" onChange={handleChange} required className="p-2 border rounded">
          <option value="">Select Blood Type</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bt) => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>

        <input name="age" type="number" placeholder="Age" onChange={handleChange} required className="p-2 border rounded" />
        <input name="weight" type="number" placeholder="Weight (kg)" onChange={handleChange} required className="p-2 border rounded" />
        <input name="hemoglobin" type="number" step="0.1" placeholder="Hemoglobin (g/dL)" onChange={handleChange} required className="p-2 border rounded" />

        <select name="gender" onChange={handleChange} required className="p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label className="text-gray-700">
          Last Donation Date (optional):
          <input name="lastDonationDate" type="date" onChange={handleChange} className="p-2 border rounded w-full mt-1" />
        </label>

        <select name="diabetic" onChange={handleChange} className="p-2 border rounded">
          <option value="No">Are you diabetic? No</option>
          <option value="Yes">Are you diabetic? Yes</option>
        </select>

        <input name="condition" placeholder="Other Health Conditions (if any)" onChange={handleChange} className="p-2 border rounded" />

        <select name="role" value={form.role} onChange={handleChange} className="p-2 border rounded" required>
          <option value="donor">Registering as: Donor</option>
          <option value="receiver">Registering as: Receiver</option>
          <option value="admin">Registering as: Admin</option>
        </select>

        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" name="consent" onChange={handleChange} />
          <span>I confirm that the information provided is accurate and I consent to participate as per the blood bank guidelines.</span>
        </label>

        <button type="submit" className="bg-red-600 text-white py-2 rounded hover:bg-red-700">
          Register
        </button>
      </form>

      <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>
    </div>
  );
};

export default RegisterPage;
