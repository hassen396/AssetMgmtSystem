import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function UserDashboard() {
  const [assets, setAssets] = useState([]);

  useEffect(()=> {
    api.get("/assets").then(res => setAssets(res.data));
  }, []);

  const requestAsset = async (assetId) => {
    try {
      await api.post("/requests", { assetId });
      alert("Requested");
    } catch (err) {
      alert("Request failed", err);
    }
  };

  return (
    <div>
      <h2>Available Assets</h2>
      <ul>
        {assets.map(a => (
          <li key={a.id}>
            {a.name} - {a.category} - {a.status}
            {a.status === "Available" && <button onClick={()=>requestAsset(a.id)}>Request</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
