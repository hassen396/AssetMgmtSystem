import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Building2,
  Calendar,
  Eye,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const Requests = () => {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Users see their own requests, admins see all requests
      const endpoint = isAdmin ? '/requests' : '/requests/my-requests';
      const [requestsResponse, assetsResponse] = await Promise.all([
        api.get(endpoint),
        api.get('/assets')
      ]);
      
      setRequests(requestsResponse.data);
      setAssets(assetsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await api.post(`/requests/${requestId}/approve`);
      toast.success('Request approved successfully');
      // Refresh the data
      fetchData();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.post(`/requests/${requestId}/reject`);
      toast.success('Request rejected successfully');
      // Refresh the data
      fetchData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      0: {
        icon: Clock,
        classes: 'bg-yellow-100 text-yellow-800',
        text: 'Pending'
      },
      1: {
        icon: CheckCircle,
        classes: 'bg-green-100 text-green-800',
        text: 'Approved'
      },
      2: {
        icon: XCircle,
        classes: 'bg-red-100 text-red-800',
        text: 'Rejected'
      }
    };

    const config = statusConfig[status] || statusConfig[0];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getAssetName = (assetId) => {
    const asset = assets.find(a => a.id === assetId);
    return asset ? asset.name : 'Unknown Asset';
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === 'all' || request.status.toString() === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Asset Requests Management' : 'My Asset Requests'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Manage asset requests from users' : 'Track your asset requests'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Requests</option>
            <option value="0">Pending</option>
            <option value="1">Approved</option>
            <option value="2">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">
            {statusFilter !== 'all' 
              ? `No ${statusFilter === '0' ? 'pending' : statusFilter === '1' ? 'approved' : 'rejected'} requests` 
              : isAdmin ? 'No asset requests have been made yet' : 'You haven\'t made any asset requests yet'}
          </p>
          {!isAdmin && (
            <div className="mt-4">
              <a
                href="/assets"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Browse Available Assets
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {filteredRequests.length} Request{filteredRequests.length !== 1 ? 's' : ''}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {getAssetName(request.assetId)}
                          </h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            Asset ID: {request.assetId}
                          </div>
                          {isAdmin && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              User ID: {request.userId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isAdmin && request.status === 0 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {requests.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Request Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 0).length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 1).length}
              </div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.status === 2).length}
              </div>
              <div className="text-sm text-gray-500">Rejected</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests; 