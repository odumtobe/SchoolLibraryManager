const Student = require('../models/student.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createStudent = async (req, res, next) => {
    try {
        const { name, email, phone, password, studentId } = req.body;

        // NOTE: password hashing is handled by models/student.model.js pre('save') hook

        // check for existing User

        const existingEmail = await Student.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        // check for existing Phone Number
        const existingPhone = await Student.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: "User with this phone number already exists" });
        }
        const existingStudentId = await Student.findOne({ studentId });
        if (existingStudentId) {
            return res.status(400).json({ message: "User with this student ID already exists" });
        }

        const newStudent = new Student({
            name,
            email,
            studentId,
            phone,
            password,
        });

        await newStudent.save();

        res.status(201).json({
            message: 'Student created successfully',
            student: newStudent,
        });
    } catch (error) {
        console.error('createStudent error:', error);
        console.error('createStudent stack:', error?.stack);
        res.status(500).json({ message: 'Student could not be created', error: error?.message || error });
    }
};

// Login
exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        // password is selected:false in schema, so it is explicitly included
        const student = await Student.findOne({ email }).select('+password');
        if (!student) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate jwt
        const token = jwt.sign(
            {
                id: student._id,
                role: student.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const safeStudent = student.toObject ? student.toObject() : student;
        delete safeStudent.password;

        return res.status(200).json({
            message: "Login successful",
            student: safeStudent,
            token,
        });
    } catch (error) {
        console.error('loginStudent error:', error);
        return res.status(500).json({ message: "Error occurred while logging in", error: error?.message || error });
    }

};
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateStudent = async (req, res) => {
    try {
        const { name, email, studentId, password } = req.body;
        let updateData = { name, email, studentId };
        
        // NOTE: password hashing is handled by models/student.model.js pre('save') hook
        // so set  raw password here.
        if (password) {
            updateData.password = password;
        }


        const student = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student updated successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Student could not be updated" });
    }
};
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Student could not be deleted" });
    }
};

// Reset password
// Expects: { "password": "newRawPassword" }
exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Load student, set raw password; model pre('save') will hash it.
        const student = await Student.findById(req.params.id).select('+password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.password = password;
        await student.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('resetPassword error:', error);
        return res.status(500).json({ message: 'Student password could not be updated', error: error?.message || error });
    }
};

