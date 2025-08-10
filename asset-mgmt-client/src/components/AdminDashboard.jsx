import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  Building2, 
  ClipboardList, 
  Plus, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [assetsResponse, requestsResponse] = await Promise.all([
        api.get('/assets'),
        api.get('/requests')
      ]);

      const assets = assetsResponse.data;
      const requests = requestsResponse.data;

      setStats({
        totalAssets: assets.length,
        availableAssets: assets.filter(asset => asset.status === 0).length,
        assignedAssets: assets.filter(asset => asset.status === 1).length,
        pendingRequests: requests.filter(req => req.status === 0).length,
        approvedRequests: requests.filter(req => req.status === 1).length,
        rejectedRequests: requests.filter(req => req.status === 2).length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Admin'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your asset management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assets Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Assets
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalAssets}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.availableAssets}
              </div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.assignedAssets}
              </div>
              <div className="text-sm text-gray-500">Assigned</div>
            </div>
          </div>
        </div>

        {/* Requests Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardList className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Asset Requests
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.pendingRequests + stats.approvedRequests + stats.rejectedRequests}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingRequests}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.approvedRequests}
              </div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.rejectedRequests}
              </div>
              <div className="text-sm text-gray-500">Rejected</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/assets"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Eye className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">View Assets</span>
            </Link>
            <Link
              to="/assets/new"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <Plus className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Add Asset</span>
            </Link>
            <Link
              to="/requests"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <Clock className="h-5 w-5 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Manage Requests</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>No recent activity to display</p>
            <p className="text-sm">Activity will appear here as you use the system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
