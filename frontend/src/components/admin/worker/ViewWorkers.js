import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const WORKER_URL = '/admin/workers';

function ViewWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(WORKER_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setWorkers(response.data);
      } catch (err) {
        setError('Failed to fetch workers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading workers...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Existing Workers</h3>
      {workers.length === 0 ? (
        <p>No workers found. Please add a worker.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workers.map((worker) => (
                <tr key={worker._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.department.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.salary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.workingHours.from} - {worker.workingHours.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewWorkers;