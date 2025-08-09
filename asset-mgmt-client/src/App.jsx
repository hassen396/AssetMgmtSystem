import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AuthContext from "./context/AuthContext";
import AuthProvider from "./context/AuthProvider";


import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
import UserAssets from "./components/User/AssetList";
import AdminAssets from "./components/Admin/AssetList";
import AdminRequests from "./components/Admin/RequestList";

const RequireAuth = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

          <Route
            path="/"
            element={
              <RequireAuth>
                {user?.role === "Admin" ? <AdminAssets /> : <UserAssets />}
              </RequireAuth>
            }
          />

          <Route
            path="/admin/requests"
            element={
              <RequireAuth role="Admin">
                <AdminRequests />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
