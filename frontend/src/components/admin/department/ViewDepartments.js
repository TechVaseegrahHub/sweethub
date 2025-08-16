import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const DEPARTMENTS_URL = '/admin/departments';

function ViewDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

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

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${DEPARTMENTS_URL}/${id}`, 
        { name: editingName },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setDepartments(departments.map(d => d._id === id ? response.data : d));
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      setError('Failed to update department.');
      console.error(err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DEPARTMENTS_URL}/${id}`, {
        withCredentials: true,
      });
      setDepartments(departments.filter((d) => d._id !== id));
    } catch (err) {
      setError('Failed to delete department.');
      console.error(err);
    }
  };

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
            <li key={dept._id} className="py-4 flex justify-between items-center">
              {editingId === dept._id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              ) : (
                <div>
                  <p className="font-medium text-gray-900">{dept.name}</p>
                  <p className="text-sm text-gray-500">Workers: {dept.workers.length}</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                {editingId === dept._id ? (
                  <button onClick={() => handleUpdate(dept._id)} className="text-green-600 hover:text-green-900">Save</button>
                ) : (
                  <button onClick={() => { setEditingId(dept._id); setEditingName(dept.name); }} className="text-blue-600 hover:text-blue-900">Edit</button>
                )}
                <button onClick={() => handleDelete(dept._id)} className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewDepartments;