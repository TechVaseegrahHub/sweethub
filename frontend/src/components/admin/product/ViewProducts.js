import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const PRODUCT_URL = '/admin/products';
const CATEGORY_URL = '/admin/categories';

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(PRODUCT_URL, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_URL, { withCredentials: true });
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let tempProducts = products;

    if (selectedCategory !== 'All') {
      tempProducts = tempProducts.filter(
        (product) => product.category?._id === selectedCategory
      );
    }

    if (searchTerm) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(tempProducts);
  }, [products, selectedCategory, searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${PRODUCT_URL}/${id}`, {
        withCredentials: true,
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError('Failed to delete product.');
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct({});
  };

  const handleInputChange = (e, field) => {
    setEditedProduct({ ...editedProduct, [field]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${PRODUCT_URL}/${id}`, editedProduct, {
        withCredentials: true,
      });

      // After updating, refetch all products to ensure data consistency
      fetchProducts();
      handleCancelEdit();
    } catch (err) {
      setError('Failed to update product.');
      console.error(err);
    }
  };

  const openEditModal = (product) => {
    setEditedProduct({ ...product, category: product.category?._id || '' });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditedProduct({});
  };

  const handleModalUpdate = async () => {
    try {
      await axios.put(`${PRODUCT_URL}/${editedProduct._id}`, editedProduct, {
        withCredentials: true,
      });
      fetchProducts(); // Refresh the product list
      closeEditModal(); // Close the modal
    } catch (err) {
      setError('Failed to update product.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">View Products</h3>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.netPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.sellingPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockLevel} {product.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category ? product.category.name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Product</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" value={editedProduct.name} onChange={(e) => handleInputChange(e, 'name')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input type="text" value={editedProduct.sku} onChange={(e) => handleInputChange(e, 'sku')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Type</label>
                  <select value={editedProduct.productType} onChange={(e) => handleInputChange(e, 'productType')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="finished_product">Finished Product</option>
                    <option value="raw_material">Raw Material</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Net Price</label>
                  <input type="number" value={editedProduct.netPrice} onChange={(e) => handleInputChange(e, 'netPrice')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                  <input type="number" value={editedProduct.sellingPrice} onChange={(e) => handleInputChange(e, 'sellingPrice')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" value={editedProduct.stockLevel} onChange={(e) => handleInputChange(e, 'stockLevel')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select value={editedProduct.category} onChange={(e) => setEditedProduct({...editedProduct, category: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={closeEditModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button onClick={handleModalUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default ViewProducts;