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

exports.updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDepartment = await Department.findByIdAndDelete(id);
        if (!deletedDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};