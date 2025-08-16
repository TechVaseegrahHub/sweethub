import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const PRODUCT_URL = '/admin/products';
const CATEGORY_URL = '/admin/categories';

function AddProduct() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSku] = useState('');
  const [netPrice, setNetPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockLevel, setStockLevel] = useState('');
  const [unit, setUnit] = useState('piece');
  const [productType, setProductType] = useState('finished_product');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORY_URL, { withCredentials: true });
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategory(response.data[0]._id);
        }
      } catch (err) {
        setError('Failed to load categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post(
        PRODUCT_URL,
        JSON.stringify({
          name: productName,
          category,
          sku,
          netPrice,
          sellingPrice,
          stockLevel,
          unit,
          productType,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setMessage(`Product "${productName}" created successfully!`);
      setProductName('');
      setSku('');
      setNetPrice('');
      setSellingPrice('');
      setStockLevel('');
      setUnit('piece');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product. Please check the form data.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Product</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productType">
            Product Type
          </label>
          <select
            id="productType"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            required
          >
            <option value="finished_product">Finished Product</option>
            <option value="raw_material">Raw Material</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
              Product Name
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sku">
              SKU
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="netPrice">
              Net Price
            </label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="netPrice"
              value={netPrice}
              onChange={(e) => setNetPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sellingPrice">
              Selling Price
            </label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sellingPrice"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stockLevel">
              Stock Level
            </label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="stockLevel"
              value={stockLevel}
              onChange={(e) => setStockLevel(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
              Unit
            </label>
            <select
              id="unit"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            >
              <option value="piece">piece</option>
              <option value="kg">kg</option>
              <option value="gram">gram</option>
              <option value="box">box</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Product
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

export default AddProduct;