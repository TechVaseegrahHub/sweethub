import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';

const ATTENDANCE_URL = '/admin/attendance';

// Helper function to format time
const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Helper function to calculate working time
const calculateWorkingTime = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '0h 0m';
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.round((diffMs % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}m`;
};

const MonthlyCalendar = ({ workers, attendance, month, year, onMonthChange }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDayInitial = (day) => {
      const date = new Date(year, month, day);
      return dayNames[date.getDay()];
  };

  const getAttendanceStatusForDay = (worker, day) => {
      const date = new Date(year, month, day);
      const record = worker.attendance.find(att => {
          const checkInDate = new Date(att.checkIn);
          return checkInDate.getDate() === date.getDate() &&
                 checkInDate.getMonth() === date.getMonth() &&
                 checkInDate.getFullYear() === date.getFullYear();
      });

      if (record) {
        <div className="w-4 h-4 bg-green-200 rounded-full mx-auto" title={`Present: In at ${formatTime(record.checkIn)}, Out at ${formatTime(record.checkOut)}`}></div>;
      }
      
      // Simple check for weekend (Saturday or Sunday)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
           return <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto" title="Weekend"></div>;
      }
      
      return <div className="w-4 h-4 bg-red-200 rounded-full mx-auto" title="Absent"></div>;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Monthly Attendance Overview</h3>
              <div className="flex items-center space-x-2">
                  <button onClick={() => onMonthChange(-1)} className="p-2 rounded-md hover:bg-light-gray">&lt;</button>
                  <span className="font-semibold">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => onMonthChange(1)} className="p-2 rounded-md hover:bg-light-gray">&gt;</button>
              </div>
          </div>
          <div>
              <table className="min-w-full">
                  <thead>
                      <tr>
                      <th className="w-24 sm:w-32 md:w-40 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                          {days.map(day => (
                            <th key={day} className="p-1 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  <div>{day}</div>
                                  <div>{getDayInitial(day)}</div>
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="bg-white">
                      {workers.map(worker => (
                          <tr key={worker._id}>
                      <td className="w-24 sm:w-32 md:w-40 px-2 py-4 whitespace-nowrap font-semibold">{worker.name}</td>
                              {days.map(day => (
                              <td key={day} className="p-1 text-center">
                                      {getAttendanceStatusForDay(worker, day)}
                                  </td>
                              ))}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );
};


function AttendanceTracking() {
  const [todaysAttendanceData, setTodaysAttendanceData] = useState([]);
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTodaysAttendance = useCallback(async () => {
      try {
          const response = await axios.get(ATTENDANCE_URL, { withCredentials: true });
          setTodaysAttendanceData(response.data);
      } catch (err) {
          setError('Failed to fetch today\'s attendance data.');
          console.error(err);
      }
  }, []);

  const fetchMonthlyAttendance = useCallback(async (year, month) => {
      try {
          const response = await axios.get(`${ATTENDANCE_URL}/monthly/${year}/${month}`, { withCredentials: true });
          setMonthlyAttendanceData(response.data);
      } catch (err) {
          setError('Failed to fetch monthly attendance data.');
          console.error(err);
      }
  }, []);

  useEffect(() => {
      const loadData = async () => {
          setLoading(true);
          await fetchTodaysAttendance();
          await fetchMonthlyAttendance(currentDate.getFullYear(), currentDate.getMonth() + 1);
          setLoading(false);
      };
      loadData();
  }, [fetchTodaysAttendance, fetchMonthlyAttendance, currentDate]);

  const handleMonthChange = (increment) => {
      setCurrentDate(prevDate => {
          const newDate = new Date(prevDate);
          newDate.setMonth(newDate.getMonth() + increment);
          return newDate;
      });
  };

  const handleCheckIn = async (workerId) => {
      try {
          await axios.post(`${ATTENDANCE_URL}/checkin`, { workerId }, { withCredentials: true });
          fetchTodaysAttendance(); // Refresh data
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to check in.');
          console.error(err);
      }
  };

  const handleCheckOut = async (workerId) => {
      try {
          await axios.post(`${ATTENDANCE_URL}/checkout`, { workerId }, { withCredentials: true });
          fetchTodaysAttendance(); // Refresh data
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to check out.');
          console.error(err);
      }
  };
  
  const filteredData = todaysAttendanceData.filter(worker =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
      return <div className="p-6 text-center">Loading attendance data...</div>;
  }

  if (error) {
      return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative w-full md:w-1/3">
                <input
                    type="text"
                    placeholder="Search by staff name or ID..."
                    className="w-full pl-10 pr-4 py-2 border border-medium-gray rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <button className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto">
                Apply Week Off
            </button>
                <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Shop Default Hours:</span>
                    <input type="number" defaultValue="8" className="w-16 p-2 border border-medium-gray rounded-lg" />
                </div>
            </div>
        </div>

        {/* Today's Attendance Table */}
        <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
                Today's Attendance ({new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})
            </h3>
            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="w-40 px-2 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In/Out</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Working Time</th>
                            <th className="px-2 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((worker) => (
                            <tr key={worker._id}>
                              <td className="w-40 px-2 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="font-semibold">{worker.name}</div>
                                        <div className="text-sm text-gray-500 ml-2">({worker.username})</div>
                                    </div>
                                </td>
                                <td className="w-40 px-2 sm:px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${worker.attendance && worker.attendance.checkIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {worker.attendance?.checkOut ? 'Completed' : worker.attendance?.checkIn ? 'Present' : 'Not Recorded'}
                                    </span>
                                </td>
                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>In: {formatTime(worker.attendance?.checkIn)}</div>
                                    <div>Out: {formatTime(worker.attendance?.checkOut)}</div>
                                </td>
                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                    {calculateWorkingTime(worker.attendance?.checkIn, worker.attendance?.checkOut)}
                                </td>
                                <td className="w-40 px-2 sm:px-6 py-4 whitespace-nowrap">
                                    {!worker.attendance?.checkIn ? (
                                       <button onClick={() => handleCheckIn(worker._id)} className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                                       Check In
                                   </button>
                                    ) : !worker.attendance?.checkOut ? (
                                        <button onClick={() => handleCheckOut(worker._id)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                            Check Out
                                        </button>
                                    ) : (
                                        <span className="text-gray-500">Done</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Monthly Attendance Overview */}
        <MonthlyCalendar
            workers={monthlyAttendanceData}
            month={currentDate.getMonth()}
            year={currentDate.getFullYear()}
            onMonthChange={handleMonthChange}
        />
    </div>
);
}

export default AttendanceTracking;