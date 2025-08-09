import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Requests");
      setRequests(res.data);
    } catch {
      alert("Failed to load requests");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/Requests/${id}/approve`);
      fetchRequests();
    } catch {
      alert("Approve failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/Requests/${id}/reject`);
      fetchRequests();
    } catch {
      alert("Reject failed");
    }
  };

  if (loading) return <p className="p-4">Loading requests...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl mb-4 font-semibold">Asset Requests</h1>
      <table className="w-full border-collapse border text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Request ID</th>
            <th className="border p-2">Asset Name</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.id}</td>
              <td className="border p-2">{r.asset?.name || "N/A"}</td>
              <td className="border p-2">{r.user?.email || "N/A"}</td>
              <td className="border p-2">{r.status}</td>
              <td className="border p-2 space-x-2">
                {r.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                {r.status !== "Pending" && <span>{r.status}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
