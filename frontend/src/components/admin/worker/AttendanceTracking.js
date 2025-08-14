import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const WORKERS_URL = '/admin/workers';
const ATTENDANCE_URL = '/admin/attendance'; // Assuming an attendance API endpoint

function AttendanceTracking() {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(WORKERS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setWorkers(response.data);
        if (response.data.length > 0) {
          setSelectedWorker(response.data[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch workers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!selectedWorker || !checkInTime) {
      setError('Please select a worker and a check-in time.');
      return;
    }

    try {
      await axios.post(
        `${ATTENDANCE_URL}/checkin`,
        { worker: selectedWorker, checkIn: checkInTime },
        { withCredentials: true }
      );
      setMessage(`Worker checked in at ${new Date(checkInTime).toLocaleTimeString()}!`);
      setCheckInTime('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check in.');
      console.error(err);
    }
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!selectedWorker || !checkOutTime) {
      setError('Please select a worker and a check-out time.');
      return;
    }

    try {
      await axios.post(
        `${ATTENDANCE_URL}/checkout`,
        { worker: selectedWorker, checkOut: checkOutTime },
        { withCredentials: true }
      );
      setMessage(`Worker checked out at ${new Date(checkOutTime).toLocaleTimeString()}!`);
      setCheckOutTime('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check out.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading worker data...</div>;
  }

  if (error && !message) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Attendance Tracking</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="worker">
            Select Worker
          </label>
          <select
            id="worker"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
          >
            {workers.map((worker) => (
              <option key={worker._id} value={worker._id}>
                {worker.name}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={handleCheckIn} className="space-y-2">
          <label className="block text-gray-700 text-sm font-bold mb-1">Check-In</label>
          <input
            type="datetime-local"
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Check In
          </button>
        </form>
        <form onSubmit={handleCheckOut} className="space-y-2">
          <label className="block text-gray-700 text-sm font-bold mb-1">Check-Out</label>
          <input
            type="datetime-local"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Check Out
          </button>
        </form>
      </div>
      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

export default AttendanceTracking;  