// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

// ❌ Commenting out all others for now
 import Navbar from "./components/Navbar";
 import DonateForm from "./pages/DonateForm";
import RequestForm from "./pages/RequestForm";
import LoginPage from "./pages/LoginPage";
 import Dashboard from "./pages/Dashboard";
 import AdminDashboard from "./pages/AdminDashboard";
 import MyDonations from "./pages/MyDonations";
import MyRequests from "./pages/MyRequests";
import BloodSearch from "./pages/BloodSearch";
import RegisterPage from "./pages/RegisterPage";
// import NotificationBar from "./components/NotificationBar";

function App() {
  return (
    <Router>
      <Navbar />
      {/* <NotificationBar /> */}
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          { <><Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/donate" element={<DonateForm />} />
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/admin" element={<AdminDashboard />} />
           <Route path="/my-donations" element={<MyDonations />} />
           <Route path="/my-requests" element={<MyRequests />} />
           <Route path="/search" element={<BloodSearch />} />
           <Route path="/request" element={<RequestForm />} /></>}
          
        </Routes>

        <div className="overflow-hidden whitespace-nowrap mt-8">
          <p className="inline-block animate-marquee text-red-600 text-lg font-semibold">
            🩸 “A single pint can save three lives, a single gesture can create a million smiles.” 🩸
          </p>
        </div>
      </div>
    </Router>
  );
}

export default App;
