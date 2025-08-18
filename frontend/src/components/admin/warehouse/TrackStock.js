import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const PRODUCTS_URL = '/admin/products';

function TrackStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedThreshold, setEditedThreshold] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(PRODUCTS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch product data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setEditedThreshold(product.stockAlertThreshold || '');
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setEditedThreshold('');
    setIsModalOpen(false);
  };

  const handleUpdate = async (productId) => {
    try {
      await axios.put(`${PRODUCTS_URL}/${productId}`, {
        stockAlertThreshold: editedThreshold,
      });
      setProducts(
        products.map((p) =>
          p._id === productId ? { ...p, stockAlertThreshold: editedThreshold } : p
        )
      );
      handleCancel(); // This will now also close the modal
    } catch (err) {
      setError('Failed to update threshold.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading stock data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Track Stock</h3>
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Alert Threshold</th>
            </tr>
          </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{(product.sellingPrice || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockLevel} {product.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{((product.stockLevel || 0) * (product.sellingPrice || 0)).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>{product.stockAlertThreshold}</span>
                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Stock Alert Threshold</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Threshold</label>
              <input
                type="number"
                value={editedThreshold}
                onChange={(e) => setEditedThreshold(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={() => handleUpdate(editingProductId)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackStock;