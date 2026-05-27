const express = require('express');
const router = express.Router();
const studentController = require('../controller/student.controller');



// Create a new student
router.post('/students', studentController.createStudent);

//Login
router.post('/login', studentController.loginStudent);

// Get all students
router.get('/students/all', studentController.getStudents);

// Get a single student by ID
// FIX: use /students/:id to avoid conflict with book routes (both had /api/:id)
router.get('/students/:id', studentController.getStudentById);

// Update a student by ID
router.put('/students/:id', studentController.updateStudent);

// Delete a student by ID
router.delete('/students/:id', studentController.deleteStudent);

// Reset password
router.put('/students/:id/password', studentController.resetPassword);

module.exports = router;

