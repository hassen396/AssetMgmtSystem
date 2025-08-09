import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(()=>{
    api.get("/assets").then(res => setAssets(res.data));
    api.get("/requests").then(res => setRequests(res.data));
  }, []);

  const approve = async (id) => {
    await api.post(`/requests/${id}/approve`);
    // refresh
    const r = await api.get("/requests"); setRequests(r.data);
    const a = await api.get("/assets"); setAssets(a.data);
  };

  const reject = async (id) => {
    await api.post(`/requests/${id}/reject`);
    const r = await api.get("/requests"); setRequests(r.data);
  };

  return (
    <div>
      <h2>Admin - Assets</h2>
      <ul>{assets.map(a => <li key={a.id}>{a.name} ({a.status})</li>)}</ul>

      <h2>Requests</h2>
      <ul>{requests.map(r => (
        <li key={r.id}>
          Request #{r.id} - Asset: {r.asset?.name} - Status: {r.status}
          {r.status === "Pending" && <>
             <button onClick={()=>approve(r.id)}>Approve</button>
             <button onClick={()=>reject(r.id)}>Reject</button>
          </>}
        </li>
      ))}</ul>
    </div>
  );
}
