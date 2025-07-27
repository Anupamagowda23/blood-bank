// client/src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-red-100 shadow">
      <h2 className="text-2xl font-bold text-red-700">🩸 Blood Bank</h2>

      <div className="flex gap-4 items-center">
        {/* Always visible */}
        <Link to="/" className="hover:text-red-600">Home</Link>

        {/* Visible only if not logged in */}
        {!user && (
          <>
            <Link to="/register" className="hover:text-red-600">Register</Link>
            <Link to="/login" className="hover:text-red-600">Login</Link>
          </>
        )}

        {/* Visible only if user is logged in */}
        {user && (
          <>
            {/* For normal users (donor/receiver) */}
            {user.role !== "admin" && (
              <>
                <Link to="/dashboard" className="hover:text-red-600">Dashboard</Link>
                <Link to="/donate" className="hover:text-red-600">Donate</Link>
                <Link to="/request" className="hover:text-red-600">Request</Link>
                <Link to="/my-donations" className="hover:text-red-600">My Donations</Link>
                <Link to="/my-requests" className="hover:text-red-600">My Requests</Link>
                <Link to="/search" className="hover:text-red-600">Search</Link>
              </>
            )}

            {/* For admin users */}
            {user.role === "admin" && (
              <>
                <Link to="/admin" className="hover:text-red-600">Admin Dashboard</Link>
                
              </>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
