import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your Asset Management Dashboard</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Assets</h3>
            <p className="text-gray-600 mt-2">Manage your assets</p>
            <Link to="/assets" className="btn-primary mt-4 w-full">
              View Assets
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-600 text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Requests</h3>
            <p className="text-gray-600 mt-2">View your requests</p>
            <Link to="/requests" className="btn-primary mt-4 w-full">
              View Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
