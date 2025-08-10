import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  Building2, 
  ClipboardList, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    myRequests: 0,
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
      const [availableAssetsResponse, myRequestsResponse] = await Promise.all([
        api.get('/assets/available'),
        api.get('/requests/my-requests')
      ]);

      const availableAssets = availableAssetsResponse.data;
      const myRequests = myRequestsResponse.data;

      setStats({
        totalAssets: availableAssets.length,
        availableAssets: availableAssets.length,
        myRequests: myRequests.length,
        pendingRequests: myRequests.filter(req => req.status === 0).length,
        approvedRequests: myRequests.filter(req => req.status === 1).length,
        rejectedRequests: myRequests.filter(req => req.status === 2).length
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
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your asset requests and available assets.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Available Assets Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Available Assets
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.availableAssets}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/assets"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Available Assets
            </Link>
          </div>
        </div>

        {/* My Requests Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardList className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  My Requests
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.myRequests}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {stats.pendingRequests}
              </div>
              <div className="text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {stats.approvedRequests}
              </div>
              <div className="text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {stats.rejectedRequests}
              </div>
              <div className="text-gray-500">Rejected</div>
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
              <span className="text-sm font-medium text-gray-900">Browse Assets</span>
            </Link>
            <Link
              to="/requests"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <ClipboardList className="h-5 w-5 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">My Requests</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Requests</h3>
        </div>
        <div className="p-6">
          {stats.myRequests === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>No requests yet</p>
              <p className="text-sm">Start by browsing available assets</p>
              <Link
                to="/assets"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Browse Assets
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* This would show recent requests - simplified for now */}
              <div className="text-center text-gray-500 py-4">
                <p>Your recent requests will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
