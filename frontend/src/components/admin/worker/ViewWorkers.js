import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const WORKER_URL = '/admin/workers';

function ViewWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingWorkerId, setEditingWorkerId] = useState(null);
  const [editedWorker, setEditedWorker] = useState({});
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [workersResponse, departmentsResponse] = await Promise.all([
                axios.get(WORKER_URL, { withCredentials: true }),
                axios.get('/admin/departments', { withCredentials: true })
            ]);
            setWorkers(workersResponse.data);
            setDepartments(departmentsResponse.data);
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);

const handleEdit = (worker) => {
  setEditingWorkerId(worker._id);
  setEditedWorker({ ...worker, department: worker.department._id }); // Store department ID
};

const handleCancelEdit = () => {
  setEditingWorkerId(null);
  setEditedWorker({});
};

const handleInputChange = (e, field) => {
  setEditedWorker({ ...editedWorker, [field]: e.target.value });
};

const handleUpdate = async (id) => {
  try {
      await axios.put(`${WORKER_URL}/${id}`, editedWorker, { withCredentials: true });
      setWorkers(workers.map(w => w._id === id ? { ...editedWorker, department: departments.find(d => d._id === editedWorker.department) } : w));
      handleCancelEdit();
  } catch (err) {
      setError('Failed to update worker.');
      console.error(err);
  }
};

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
          await axios.delete(`${WORKER_URL}/${id}`, { withCredentials: true });
          setWorkers(workers.filter((w) => w._id !== id));
      } catch (err) {
          setError('Failed to delete worker.');
          console.error(err);
      }
  }
};

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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
        {workers.map((worker) => (
            <tr key={worker._id}>
                {editingWorkerId === worker._id ? (
                    <>
                        <td className="px-6 py-4"><input type="text" value={editedWorker.name} onChange={(e) => handleInputChange(e, 'name')} className="shadow-sm border-gray-300 rounded-md" /></td>
                        <td className="px-6 py-4"><input type="text" value={editedWorker.username} onChange={(e) => handleInputChange(e, 'username')} className="shadow-sm border-gray-300 rounded-md" /></td>
                        <td className="px-6 py-4"><input type="email" value={editedWorker.email} onChange={(e) => handleInputChange(e, 'email')} className="shadow-sm border-gray-300 rounded-md" /></td>
                        <td className="px-6 py-4">
                            <select value={editedWorker.department} onChange={(e) => handleInputChange(e, 'department')} className="shadow-sm border-gray-300 rounded-md">
                                {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                            </select>
                        </td>
                        <td className="px-6 py-4"><input type="number" value={editedWorker.salary} onChange={(e) => handleInputChange(e, 'salary')} className="shadow-sm border-gray-300 rounded-md" /></td>
                        <td className="px-6 py-4"><input type="text" value={`${editedWorker.workingHours.from} - ${editedWorker.workingHours.to}`} readOnly className="shadow-sm border-gray-300 rounded-md bg-gray-100" /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleUpdate(worker._id)} className="text-green-600 hover:text-green-900 mr-4">Save</button>
                            <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-900">Cancel</button>
                        </td>
                    </>
                ) : (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.user?.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.department?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.salary}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.workingHours.from} - {worker.workingHours.to}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleEdit(worker)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                            <button onClick={() => handleDelete(worker._id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                    </>
                )}
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