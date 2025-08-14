import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const SHOP_URL = '/shop';

function ShopDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${SHOP_URL}/dashboard`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Shop Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-700">Total Sales Today</h4>
          <p className="text-3xl font-bold text-blue-600">${dashboardData.sales || 0}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-700">Worker Attendance</h4>
          <ul className="mt-2">
            {Object.entries(dashboardData.workerAttendance || {}).map(([worker, status]) => (
              <li key={worker} className="flex justify-between items-center text-sm text-gray-600">
                <span>{worker}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'present' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-700">Current Stock Levels</h4>
          <ul className="mt-2">
            {Object.entries(dashboardData.stockLevels || {}).map(([product, level]) => (
              <li key={product} className="flex justify-between items-center text-sm text-gray-600">
                <span>{product}</span>
                <span>{level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ShopDashboard;