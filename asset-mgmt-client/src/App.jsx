import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import Assets from './components/assets/Assets';
import AssetForm from './components/assets/AssetForm';
import Requests from './components/requests/Requests';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminAssetManagement from './components/admin/AdminAssetManagement';
import AdminRequestManagement from './components/admin/AdminRequestManagement';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null); // NEW

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      // Ignore clicks on menu button
      if (menuButtonRef.current && menuButtonRef.current.contains(e.target)) {
        return;
      }

      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navbar now toggles instead of just opening */}
          <Navbar
            onMenuClick={() => setSidebarOpen(prev => !prev)}
            menuButtonRef={menuButtonRef} // Pass ref
          />

          {/* Sidebar wrapped in ref for outside click detection */}
          <div ref={sidebarRef}>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          </div>

          <div className="lg:pl-64">
            <main className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/assets"
                    element={
                      <ProtectedRoute>
                        <Assets />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/assets/new"
                    element={
                      <AdminRoute>
                        <AssetForm />
                      </AdminRoute>
                    }
                  />

                  <Route
                    path="/assets/:id/edit"
                    element={
                      <AdminRoute>
                        <AssetForm />
                      </AdminRoute>
                    }
                  />

                  <Route
                    path="/requests"
                    element={
                      <ProtectedRoute>
                        <Requests />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />

                  <Route
                    path="/admin/assets"
                    element={
                      <AdminRoute>
                        <AdminAssetManagement />
                      </AdminRoute>
                    }
                  />

                  <Route
                    path="/admin/requests"
                    element={
                      <AdminRoute>
                        <AdminRequestManagement />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
