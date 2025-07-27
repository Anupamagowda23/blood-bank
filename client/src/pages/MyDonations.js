import React, { useEffect, useState } from "react";
import axios from "axios";

const MyDonations = () => {
  const [myDonations, setMyDonations] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/donation?donor=${user._id}`)
        .then(res => setMyDonations(res.data))
        .catch(err => console.error("Error fetching user donations:", err));
    }
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧾 My Donations</h2>
      {myDonations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Blood Type</th>
              <th>Location</th>
              <th>Type of Donation</th> {/* ✅ new column */}
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {myDonations.map(d => (
              <tr key={d._id}>
                <td>{d.bloodType}</td>
                <td>{d.location}</td>
                <td>{d.component || "N/A"}</td> {/* ✅ new field */}
                <td>{new Date(d.donationDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyDonations;
