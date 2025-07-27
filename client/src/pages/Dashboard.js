import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:5000"); // Adjust backend URL if deployed

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.role === "donor") {
      socket.on("connect", () => {
        console.log("🧠 Connected to socket:", socket.id);
      });

      socket.on("new-request", (data) => {
        if (data.recipientId === user._id) {
          toast.info(data.message);
          const audio = new Audio("/notification.mp3");
          audio.play();

          setNotifications((prev) => [data, ...prev]);

          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
        }
      });

      return () => socket.disconnect();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        🚫 Please log in to access the dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-red-700 mb-2">
        👋 Welcome, {user.name}!
      </h2>
      <p className="text-gray-700">Your personalized dashboard</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-sm">
        <div className="bg-red-50 p-4 rounded shadow">
          <p className="font-semibold">Role</p>
          <p>{user.role}</p>
        </div>
        <div className="bg-red-50 p-4 rounded shadow">
          <p className="font-semibold">Location</p>
          <p>{user.location || "Not set"}</p>
        </div>
        <div className="bg-red-50 p-4 rounded shadow">
          <p className="font-semibold">Blood Type</p>
          <p>{user.bloodType || "Not provided"}</p>
        </div>
        <div className="bg-red-50 p-4 rounded shadow">
          <p className="font-semibold">Liters Donated</p>
          <p>{user.litersDonated || "0"} L</p>
        </div>
        <div className="bg-red-50 p-4 rounded shadow">
          <p className="font-semibold">Smoker</p>
          <p>{user.smoker === "Yes" ? "Yes 🚬" : "No 🚭"}</p>
        </div>
        <div className="bg-red-50 p-4 rounded shadow col-span-2 sm:col-span-3">
          <p className="font-semibold">Symptoms / Conditions</p>
          <p>{user.condition || "None reported"}</p>
        </div>
      </div>

      {/* Role-Based Actions */}
      <div className="mt-8">
        {user.role === "donor" && (
          <>
            <div className="bg-red-100 p-4 rounded-lg shadow text-center">
              <h3 className="text-lg font-bold mb-2">🩸 Donor Actions</h3>
              <p>Thank you for helping others!</p>
              <button
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => (window.location.href = "/donate")}
              >
                Donate Again
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="bg-yellow-50 mt-6 p-4 rounded shadow">
                <h4 className="font-bold text-lg text-red-700 mb-2">
                  🔔 Incoming Blood Requests
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {notifications.map((req, idx) => (
                    <li key={idx}>{req.message}</li>
                  ))}
                </ul>
                <button
                  onClick={() => setNotifications([])}
                  className="mt-3 text-xs text-red-600 hover:underline"
                >
                  Clear Notifications
                </button>
              </div>
            )}
          </>
        )}

        {user.role === "receiver" && (
          <div className="bg-red-100 p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold mb-2">🚨 Receiver Actions</h3>
            <p>Need blood urgently?</p>
            <button
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => (window.location.href = "/request")}
            >
              Request Blood
            </button>
          </div>
        )}

        {user.role === "admin" && (
          <div className="bg-red-100 p-4 rounded-lg shadow mt-6">
            <h3 className="text-lg font-bold mb-2">🛠️ Admin Panel</h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>Manage all users and roles</li>
              <li>Track donation/request history</li>
              <li>View blood stock by component</li>
            </ul>
            <button
              className="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
              onClick={() => (window.location.href = "/admin")}
            >
              Open Admin Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
