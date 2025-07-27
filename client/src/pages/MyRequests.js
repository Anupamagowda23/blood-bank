import React, { useEffect, useState } from "react";
import axios from "axios";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/request?recipient=${user._id}`);
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📥 My Blood Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Blood Type</th>
              <th>Location</th>
              <th>Requested At</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.bloodType}</td>
                <td>{r.location}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyRequests;
