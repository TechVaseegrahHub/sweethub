import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const SHOPS_URL = '/admin/shops';

function ViewShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(SHOPS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setShops(response.data);
      } catch (err) {
        setError('Failed to fetch shops.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading shops...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Existing Shops</h3>
      {shops.length === 0 ? (
        <p>No shops found. Please add one.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {shops.map((shop) => (
            <li key={shop._id} className="py-4">
              <p className="font-medium text-gray-900">{shop.name}</p>
              <p className="text-sm text-gray-500">Location: {shop.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewShops;