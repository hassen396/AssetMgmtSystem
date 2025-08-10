import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Building2,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const Assets = () => {
  const { isAdmin } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      // Users see only available assets, admins see all assets
      const endpoint = isAdmin ? '/assets' : '/assets/available';
      const response = await api.get(endpoint);
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/assets/${id}`);
        setAssets(assets.filter(asset => asset.id !== id));
        toast.success('Asset deleted successfully');
      } catch (error) {
        console.error('Error deleting asset:', error);
        toast.error('Failed to delete asset');
      }
    }
  };

  const handleRequestAsset = async (assetId) => {
    try {
      await api.post('/requests', { assetId });
      toast.success('Asset request submitted successfully');
      // Refresh assets to show updated status
      fetchAssets();
    } catch (error) {
      console.error('Error requesting asset:', error);
      toast.error(error.response?.data?.message || 'Failed to request asset');
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || asset.status.toString() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      0: { text: 'Available', classes: 'bg-green-100 text-green-800' },
      1: { text: 'Assigned', classes: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status] || { text: 'Unknown', classes: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
        {config.text}
      </span>
    );
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Assets Management' : 'Available Assets'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Manage your organization\'s assets' : 'Browse and request available assets'}
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/assets/new"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="0">Available</option>
              <option value="1">Assigned</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              {Array.from(new Set(assets.map(asset => asset.category))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : isAdmin ? 'Get started by adding your first asset' : 'No assets are currently available'}
          </p>
          {isAdmin && !searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
            <Link
              to="/assets/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              {asset.imageUrl && (
                <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                  <img
                    src={asset.imageUrl}
                    alt={asset.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {asset.name}
                  </h3>
                  {getStatusBadge(asset.status)}
                </div>
                <p className="text-sm text-gray-500 mb-2">{asset.category}</p>
                <p className="text-sm text-gray-500 mb-4">SN: {asset.serialNumber}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Purchased: {new Date(asset.purchaseDate).toLocaleDateString()}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* View details */}}
                      className="text-blue-600 hover:text-blue-800"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {isAdmin && (
                      <>
                        <Link
                          to={`/assets/edit/${asset.id}`}
                          className="text-green-600 hover:text-green-800"
                          title="Edit asset"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete asset"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {!isAdmin && asset.status === 0 && (
                      <button
                        onClick={() => handleRequestAsset(asset.id)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Request asset"
                      >
                        <User className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assets; 