import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const DEPARTMENTS_URL = '/admin/departments';

function ViewDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(DEPARTMENTS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setDepartments(response.data);
      } catch (err) {
        setError('Failed to fetch departments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading departments...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Existing Departments</h3>
      {departments.length === 0 ? (
        <p>No departments found. Please create one.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {departments.map((dept) => (
            <li key={dept._id} className="py-4">
              <p className="font-medium text-gray-900">{dept.name}</p>
              <p className="text-sm text-gray-500">Workers: {dept.workers.length}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewDepartments;