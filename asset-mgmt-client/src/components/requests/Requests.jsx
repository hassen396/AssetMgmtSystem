import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { requestAPI, assetAPI } from "../../services/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: "",
    reason: "",
  });

  useEffect(() => {
    fetchData();
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
  const fetchData = async () => {
    try {
      const [requestsResponse, assetsResponse] = await Promise.all([
        requestAPI.getMyRequests(),
        assetAPI.getAvailable(),
      ]);
      setRequests(requestsResponse.data);
      setAvailableAssets(assetsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestAPI.create(formData);
      setShowCreateForm(false);
      setFormData({ assetId: "", reason: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Asset Requests</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          {showCreateForm ? "Cancel" : "New Request"}
        </button>
      </div>

      {showCreateForm && (
        <div className="card max-w-2xl">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Create New Request
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="assetId"
                className="block text-sm font-medium text-gray-700"
              >
                Select Asset
              </label>
              <select
                id="assetId"
                name="assetId"
                required
                value={formData.assetId}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="">Select an asset</option>
                {availableAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} - {asset.category}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Request
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                required
                value={formData.reason}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Explain why you need this asset"
              />
            </div> */}

            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No requests yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first asset request to get started
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create Request
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.assetName || "Unknown Asset"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.asset?.category}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.reason}</div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getRequestStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.assetStatus === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.assetStatus === 0 ? "Available" : "Assigned"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
