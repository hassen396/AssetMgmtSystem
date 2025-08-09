import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function UserAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);
  const [error, setError] = useState(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Assets");
      setAssets(res.data);
    } catch (err) {
      setError(`Failed to load assets ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const requestAsset = async (assetId) => {
    setRequesting(assetId);
    setError(null);
    try {
      await api.post("/Requests", { assetId });
      alert("Request sent!");
      fetchAssets();
    } catch {
      setError("Failed to request asset");
    } finally {
      setRequesting(null);
    }
  };

  if (loading) return <p className="p-4">Loading assets...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Available Assets</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Serial Number</th>
            <th className="border p-2">Purchase Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.id} className="text-center">
              <td className="border p-2">{a.name}</td>
              <td className="border p-2">{a.category}</td>
              <td className="border p-2">{a.serialNumber}</td>
              <td className="border p-2">{new Date(a.purchaseDate).toLocaleDateString()}</td>
              <td className="border p-2">{a.status === 0 ? "Available" : "Assigned"}</td>
              <td className="border p-2">
                {a.status === 0 ? (
                  <button
                    onClick={() => requestAsset(a.id)}
                    disabled={requesting === a.id}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {requesting === a.id ? "Requesting..." : "Request"}
                  </button>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
