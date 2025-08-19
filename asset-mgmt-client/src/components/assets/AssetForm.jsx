import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetAPI } from '../../services/api';

export default function AssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    serialNumber: '',
    purchaseDate: '',
    status: 0,
    image: null, // NEW
    imageUrl: '', // For edit preview
  });

  useEffect(() => {
    if (id) {
      fetchAsset();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      const response = await assetAPI.getById(id);
      const asset = response.data;
      setFormData({
        name: asset.name || '',
        category: asset.category || '',
        serialNumber: asset.serialNumber || '',
        purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
        status: asset.status ?? 0,
        image: null,
        imageUrl: asset.imageUrl || '',
      });
    } catch (error) {
      console.error('Error fetching asset:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value) : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await assetAPI.update(id, formData);
      } else {
        await assetAPI.create(formData);
      }
      navigate('/assets');
    } catch (error) {
      console.error('Error saving asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Asset' : 'Add New Asset'}
        </h1>
        <p className="text-gray-600 mt-2">
          {id ? 'Update asset information' : 'Create a new asset in the system'}
        </p>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Asset Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Enter asset name"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Serial Number */}
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              required
              value={formData.serialNumber}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Enter serial number"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              required
              value={formData.purchaseDate}
              onChange={handleChange}
              className="input-field mt-1"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value={0}>Available</option>
              <option value={1}>Assigned</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Asset Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {formData.image && (
              <p className="text-sm text-gray-500 mt-1">Selected: {formData.image.name}</p>
            )}
            {!formData.image && formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Asset"
                className="mt-2 h-32 rounded border"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : (id ? 'Update Asset' : 'Create Asset')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/assets')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
