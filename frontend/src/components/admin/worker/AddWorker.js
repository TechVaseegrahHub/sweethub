import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const WORKER_URL = '/admin/workers';
const DEPARTMENTS_URL = '/admin/departments';

function AddWorker() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [workingHoursFrom, setWorkingHoursFrom] = useState('09:00');
  const [workingHoursTo, setWorkingHoursTo] = useState('17:00');
  const [lunchBreakFrom, setLunchBreakFrom] = useState('12:00');
  const [lunchBreakTo, setLunchBreakTo] = useState('13:00');
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(DEPARTMENTS_URL, { withCredentials: true });
        setDepartments(response.data);
        if (response.data.length > 0) {
          setDepartment(response.data[0]._id);
        }
      } catch (err) {
        setError('Failed to load departments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setTempPassword('');

    const workingHours = { from: workingHoursFrom, to: workingHoursTo };
    const lunchBreak = { from: lunchBreakFrom, to: lunchBreakTo };

    try {
      const response = await axios.post(
        WORKER_URL,
        JSON.stringify({ name, username, email, department, salary, workingHours, lunchBreak }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      setTempPassword(response.data.tempPassword);
      // Reset form
      setName('');
      setUsername('');
      setEmail('');
      setSalary('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add worker. Please check the form data.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading departments...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Worker</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Salary</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Working Hours (From)</label>
            <input
              type="time"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={workingHoursFrom}
              onChange={(e) => setWorkingHoursFrom(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Working Hours (To)</label>
            <input
              type="time"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={workingHoursTo}
              onChange={(e) => setWorkingHoursTo(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Lunch Break (From)</label>
            <input
              type="time"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lunchBreakFrom}
              onChange={(e) => setLunchBreakFrom(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Lunch Break (To)</label>
            <input
              type="time"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lunchBreakTo}
              onChange={(e) => setLunchBreakTo(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Add Worker
        </button>
      </form>
      {message && (
        <p className="mt-4 text-green-500">
          {message} The temporary password is: <span className="font-bold">{tempPassword}</span>
        </p>
      )}
    </div>
  );
}

export default AddWorker;