import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const donationRes = await axios.get("http://localhost:5000/api/donation");
      setDonations(donationRes.data);

      const requestRes = await axios.get("http://localhost:5000/api/request");
      setRequests(requestRes.data);
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  const exportToCSV = (data, filename) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    for (const row of data) {
      const values = headers.map(h => JSON.stringify(row[h] || ""));
      csvRows.push(values.join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/request/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredDonations = donations.filter(d =>
    d.donor?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.bloodType?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRequests = requests.filter(r =>
    r.status !== "fulfilled" &&
    (r.recipient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.bloodType?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-red-700 mb-8 text-center">🛠️ Admin Dashboard</h2>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name or blood type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <div className="flex gap-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => exportToCSV(donations, "donations")}
          >
            Export Donations CSV
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => exportToCSV(requests, "requests")}
          >
            Export Requests CSV
          </button>
        </div>
      </div>

      {/* 🩸 Donations Table */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-red-600 mb-4">🩸 Recent Donations</h3>
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white border">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="py-2 px-4 border">Donor</th>
                <th className="py-2 px-4 border">Blood Type</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((d) => (
                <tr key={d._id} className="hover:bg-red-50">
                  <td className="py-2 px-4 border">
                    {d.donor?.name || d.donor} <br />
                    <span className="text-sm text-gray-500">{d.donor?.email}</span>
                  </td>
                  <td className="py-2 px-4 border">{d.bloodType}</td>
                  <td className="py-2 px-4 border">{d.location}</td>
                  <td className="py-2 px-4 border">{new Date(d.donationDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📥 Requests Table */}
      <div>
        <h3 className="text-2xl font-semibold text-red-600 mb-4">📥 Pending Blood Requests</h3>
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white border">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="py-2 px-4 border">Recipient</th>
                <th className="py-2 px-4 border">Blood Type</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r) => (
                <tr key={r._id} className="hover:bg-red-50">
                  <td className="py-2 px-4 border">
                    {r.recipient?.name || r.recipient} <br />
                    <span className="text-sm text-gray-500">{r.recipient?.email}</span>
                  </td>
                  <td className="py-2 px-4 border">{r.bloodType}</td>
                  <td className="py-2 px-4 border">{r.location}</td>
                  <td className="py-2 px-4 border">{new Date(r.requestDate).toLocaleString()}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => deleteRequest(r._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
