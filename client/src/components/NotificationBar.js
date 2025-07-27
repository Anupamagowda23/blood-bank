import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Make sure this matches your server URL

const NotificationBar = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    socket.on("new-request", (data) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (
        user?.role === "donor" &&
        user?.location?.toLowerCase() === data.location?.toLowerCase() &&
        user?.bloodType?.toUpperCase() === data.bloodType?.toUpperCase()
      ) {
        setAlert(data.message);
      }
    });

    return () => socket.off("new-request");
  }, []);

  if (!alert) return null;

  return (
    <div className="bg-red-200 text-red-800 font-bold p-4 text-center animate-pulse">
      {alert}
    </div>
  );
};

export default NotificationBar;
