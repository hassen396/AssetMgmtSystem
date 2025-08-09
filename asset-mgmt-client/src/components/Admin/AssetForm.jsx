import React, { useState } from "react";
import api from "../../api/api";

export default function AssetForm({ asset, onSave, onCancel }) {
  const [name, setName] = useState(asset.name || "");
  const [category, setCategory] = useState(asset.category || "");
  const [serialNumber, setSerialNumber] = useState(asset.serialNumber || "");
  const [purchaseDate, setPurchaseDate] = useState(
    asset.purchaseDate ? asset.purchaseDate.slice(0, 10) : ""
  );
  const [status, setStatus] = useState(asset.status || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      category,
      serialNumber,
      purchaseDate,
      status,
    };

    try {
      if (asset.id) {
        await api.put(`/Assets/${asset.id}`, payload);
      } else {
        await api.post("/Assets", payload);
      }
      onSave();
    } catch (error) {
      alert(`Save failed ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 mb-4 rounded shadow">
      <h2 className="text-xl mb-4">{asset.id ? "Edit Asset" : "Add Asset"}</h2>

      <div className="mb-2">
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-semibold">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-semibold">Serial Number</label>
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-semibold">Purchase Date</label>
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(parseInt(e.target.value))}
          className="w-full border p-2 rounded"
        >
          <option value={0}>Available</option>
          <option value={1}>Assigned</option>
        </select>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
