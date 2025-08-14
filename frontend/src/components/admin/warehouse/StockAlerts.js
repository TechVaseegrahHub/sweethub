import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const PRODUCTS_URL = '/admin/products';
const STOCK_ALERT_THRESHOLD = 10;

function StockAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(PRODUCTS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        const lowStock = response.data.filter(
          (product) => product.stockLevel <= STOCK_ALERT_THRESHOLD
        );
        setLowStockProducts(lowStock);
      } catch (err) {
        setError('Failed to fetch product data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading stock alerts...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Stock Alerts</h3>
      {lowStockProducts.length === 0 ? (
        <p>No low-stock alerts at this time. All products are well-stocked.</p>
      ) : (
        <div>
          <p className="text-red-500 mb-4">The following products are running low on stock:</p>
          <ul className="divide-y divide-gray-200">
            {lowStockProducts.map((product) => (
              <li key={product._id} className="py-4">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Current Stock: <span className="font-bold text-red-500">{product.stockLevel}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StockAlerts;