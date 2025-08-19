import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-md text-white">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-blue-100">
          Manage assets, requests, and track reports at a glance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6 border hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Total Assets</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">124</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 border hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Pending Requests</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">8</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 border hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Reports Generated</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">27</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link
          to="/admin/assets"
          className="bg-white border rounded-2xl shadow-md p-8 flex flex-col items-center hover:scale-105 hover:shadow-xl transition"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-blue-600 text-3xl">📦</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Asset Management
          </h3>
          <p className="text-gray-600 mt-2 text-center">
            Manage all assets in the system
          </p>
        </Link>

        <Link
          to="/admin/requests"
          className="bg-white border rounded-2xl shadow-md p-8 flex flex-col items-center hover:scale-105 hover:shadow-xl transition"
        >
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-yellow-600 text-3xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Request Management
          </h3>
          <p className="text-gray-600 mt-2 text-center">
            Approve or reject asset requests
          </p>
        </Link>

        <div className="bg-white border rounded-2xl shadow-md p-8 flex flex-col items-center hover:scale-105 hover:shadow-xl transition cursor-pointer">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-green-600 text-3xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
          <p className="text-gray-600 mt-2 text-center">
            View system analytics and reports
          </p>
        </div>
      </div>
    </div>
  );
}
