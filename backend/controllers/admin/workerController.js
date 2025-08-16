const Worker = require('../../models/workerModel');
const User = require('../../models/User');
const Department = require('../../models/departmentModel');
const bcrypt = require('bcrypt');
const Role = require('../../models/Role');
const mongoose = require('mongoose');

exports.addWorker = async (req, res) => {
    const { name, username, email, password, department, salary, workingHours, lunchBreak } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userExists = await User.findOne({ email }).session(session);
        if (userExists) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        const workerExists = await Worker.findOne({ username }).session(session);
        if (workerExists) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'A worker with this username already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const workerRole = await Role.findOne({ name: 'worker' }).session(session);
        if (!workerRole) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ message: 'Worker role not found.' });
        }

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            role: workerRole._id,
            isVerified: true
        });
        await newUser.save({ session });

        const newWorker = new Worker({
            name,
            username,
            department,
            salary,
            workingHours,
            lunchBreak,
            user: newUser._id
        });
        await newWorker.save({ session });

        await Department.findByIdAndUpdate(
            department,
            { $push: { workers: newWorker._id } },
            { session, new: true }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Worker added successfully!' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find()
            .populate('department', 'name')
            .populate('user', 'email');
        res.status(200).json(workers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};