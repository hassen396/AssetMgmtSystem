import { useState, useEffect } from "react";
import { requestAPI } from "../../services/api";

export default function AdminRequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const getRequestStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: // Pending
        return "bg-yellow-100 text-yellow-800";
      case 1: // Approved
        return "bg-green-100 text-green-800";
      case 2: // Rejected
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await requestAPI.getAll();
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await requestAPI.approve(id);
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await requestAPI.reject(id);
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
        <p className="text-gray-600 mt-2">Manage asset requests from users</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.assetName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getRequestStatusText(request.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
