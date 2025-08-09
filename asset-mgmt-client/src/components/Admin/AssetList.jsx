import React, { useEffect, useState } from "react";
import api from "../../api/api";
import AssetForm from "./AssetForm";

export default function AdminAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAsset, setEditingAsset] = useState(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Assets");
      setAssets(res.data);
    } catch (error) {
      alert(`Failed to fetch assets ${error}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const deleteAsset = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await api.delete(`/Assets/${id}`);
      fetchAssets();
    } catch {
      alert("Delete failed");
    }
  };

  const onSave = () => {
    setEditingAsset(null);
    fetchAssets();
  };

  if (loading) return <p className="p-4">Loading assets...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Assets</h1>

      <button
        onClick={() => setEditingAsset({})}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add New Asset
      </button>

      {editingAsset && <AssetForm asset={editingAsset} onSave={onSave} onCancel={() => setEditingAsset(null)} />}

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Serial Number</th>
            <th className="border p-2">Purchase Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
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
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setEditingAsset(a)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAsset(a.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
