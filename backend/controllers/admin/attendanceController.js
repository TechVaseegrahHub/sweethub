const Attendance = require('../../models/attendanceModel');
const Worker = require('../../models/workerModel');
const mongoose = require('mongoose');

// Helper to get the start and end of the current day in the local timezone
const getTodayBounds = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return { startOfDay, endOfDay };
};

exports.getTodaysAttendance = async (req, res) => {
    try {
        const { startOfDay, endOfDay } = getTodayBounds();
        
        // Get all workers
        const workers = await Worker.find().lean();

        // Get today's attendance records
        const todaysAttendance = await Attendance.find({
            checkIn: { $gte: startOfDay, $lt: endOfDay }
        }).lean();

        // Create a map for quick lookups
        const attendanceMap = new Map(todaysAttendance.map(att => [att.worker.toString(), att]));

        // Combine worker info with attendance status
        const combinedData = workers.map(worker => {
            const attendanceRecord = attendanceMap.get(worker._id.toString());
            return {
                ...worker,
                attendance: attendanceRecord || null
            };
        });

        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching today\'s attendance:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.checkIn = async (req, res) => {
    const { workerId } = req.body;
    try {
        const { startOfDay, endOfDay } = getTodayBounds();

        // Check if there is already an attendance record for this worker today
        const existingRecord = await Attendance.findOne({
            worker: workerId,
            checkIn: { $gte: startOfDay, $lt: endOfDay }
        });

        if (existingRecord) {
            return res.status(400).json({ message: 'Worker has already checked in today.' });
        }

        const newAttendance = new Attendance({
            worker: workerId,
            checkIn: new Date(),
        });
        await newAttendance.save();
        res.status(201).json(newAttendance);
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.checkOut = async (req, res) => {
    const { workerId } = req.body;
    try {
        const { startOfDay, endOfDay } = getTodayBounds();

        const attendanceRecord = await Attendance.findOneAndUpdate(
            {
                worker: workerId,
                checkIn: { $gte: startOfDay, $lt: endOfDay },
                checkOut: null // Ensure we only update records that haven't been checked out yet
            },
            {
                checkOut: new Date()
            },
            { new: true }
        );

        if (!attendanceRecord) {
            return res.status(404).json({ message: 'No active check-in found for this worker today.' });
        }

        res.json(attendanceRecord);
    } catch (error) {
        console.error('Error during check-out:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMonthlyAttendance = async (req, res) => {
    try {
        const { year, month } = req.params;

        // Month in JavaScript's Date is 0-indexed (0-11), so we subtract 1
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        // Get all workers, but only the fields we need
        const workers = await Worker.find().select('name username').lean();

        // Get all attendance records for the specified month
        const attendanceRecords = await Attendance.find({
            checkIn: { $gte: startDate, $lt: endDate }
        }).lean();
        
        // Group attendance records by worker ID for easy lookup
        const attendanceByWorker = attendanceRecords.reduce((acc, record) => {
            const workerId = record.worker.toString();
            if (!acc[workerId]) {
                acc[workerId] = [];
            }
            acc[workerId].push(record);
            return acc;
        }, {});

        // Combine worker data with their monthly attendance
        const responseData = workers.map(worker => {
            return {
                ...worker,
                attendance: attendanceByWorker[worker._id.toString()] || []
            };
        });

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching monthly attendance:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};