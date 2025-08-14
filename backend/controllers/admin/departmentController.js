const Department = require('../../models/departmentModel'); // Updated name

exports.createDepartment = async (req, res) => {
    const { name } = req.body;
    try {
        const newDepartment = new Department({ name });
        await newDepartment.save();
        res.status(201).json(newDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('workers');
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};