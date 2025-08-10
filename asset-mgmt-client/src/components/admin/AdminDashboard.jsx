import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your asset management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/assets" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Asset Management</h3>
            <p className="text-gray-600 mt-2">Manage all assets in the system</p>
          </div>
        </Link>

        <Link to="/admin/requests" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-600 text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Request Management</h3>
            <p className="text-gray-600 mt-2">Approve or reject asset requests</p>
          </div>
        </Link>

        <div className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Reports</h3>
            <p className="text-gray-600 mt-2">View system analytics and reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
