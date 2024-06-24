const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');




// Create a new employee
router.post('/employee', async (req, res) => {
    console.log('POST /employee', req.body); // Add this line for debugging
    const { firstName, lastName, email, mobilenumber, salary } = req.body;
    try {
        const newEmployee = new Employee({ firstName, lastName, email, mobilenumber, salary });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get all employees
router.get('/employee', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get an employee by ID
router.get('/employee/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an employee by ID
router.put('/employee/:id', async (req, res) => {
    const { firstName, lastName, email, mobilenumber, salary } = req.body;
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, mobilenumber, salary },
            { new: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an employee by ID
router.delete('/employee/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
