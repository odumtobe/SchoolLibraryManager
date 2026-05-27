const Librarian = require('../models/librarian.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.createLibrarian = async (req, res, next) => {
    try {
        const { name, employeeId, email, password, phone } = req.body;
        // Ensure phone is consistently used
        // (prevents accidental undefined/incorrect values)


        // check for existing User
        const existingEmail = await Librarian.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        // check for existing Phone Number
        const existingPhone = await Librarian.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: "User with this phone number already exists" });
        }
        const existingEmployeeId = await Librarian.findOne({ employeeId });
        if (existingEmployeeId) {
            return res.status(400).json({ message: "User with this employee ID already exists" });
        }

        // IMPORTANT: librarian.model.js hashes the password in pre('save')
        // So I pass the plain password here.
        const newLibrarian = new Librarian({
            name,
            employeeId,
            email,
            phone,
            password,
        });

        await newLibrarian.save();

        res.status(201).json({
            message: 'Librarian created successfully',
            librarian: newLibrarian,
        });
    } catch (error) {
        console.error('createLibrarian error:', error);
        console.error('createLibrarian stack:', error?.stack);
        res.status(500).json({ message: 'Librarian could not be created', error: error?.message || error });
    }
};

// Login
exports.loginLibrarian = async (req, res) => {
    try {
        const { email, password } = req.body;

        // password is selected:false in schema, so it is explicitly included here
        const librarian = await Librarian.findOne({ email }).select('+password');
        if (!librarian) {
            return res.status(404).json({ message: 'Librarian not found' });
        }

        const isMatch = await bcrypt.compare(password, librarian.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: librarian._id,
                role: librarian.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const safeLibrarian = librarian.toObject ? librarian.toObject() : { librarian };
        delete safeLibrarian.password;

        return res.status(200).json({
            message: 'Login successful',
            librarian: safeLibrarian,
            token,
        });
    } catch (error) {
        console.error('loginLibrarian error:', error);
        return res.status(500).json({ message: 'Librarian could not be logged in' });
    }
};

exports.getLibrarians = async (req, res) => {
    try {
        const librarians = await Librarian.find();
        res.status(200).json({ message: 'Librarians retrieved successfully', librarians });
    } catch (error) {
        res.status(500).json({ message: 'Librarians could not be retrieved' });
    }
};
exports.getLibrarianById = async (req, res) => {
    try {
        const librarian = await Librarian.findById(req.params.id);
        if (!librarian) {
            return res.status(404).json({ message: 'Librarian not found' });
        }
        res.status(200).json({ message: 'Librarian retrieved successfully', librarian });
    } catch (error) {
        res.status(500).json({ message: 'Librarian could not be retrieved' });
    }
};
exports.updateLibrarian = async (req, res) => {
    try {
        const { name, employeeId, email, password } = req.body;
        let updateData = { name, employeeId, email };
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 30);
        }

        const updatedLibrarian = await Librarian.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updatedLibrarian) {
            return res.status(404).json({ message: 'Librarian not found' });
        }
        res.status(200).json({ message: 'Librarian updated successfully', librarian: updatedLibrarian });
    } catch (error) {
        res.status(500).json({ message: 'Librarian could not be updated' });
    }
};
exports.deleteLibrarian = async (req, res) => {
    try {
        const deletedLibrarian = await Librarian.findByIdAndDelete(req.params.id);
        if (!deletedLibrarian) {
            return res.status(404).json({ message: 'Librarian not found' });
        }
        res.status(200).json({ message: 'Librarian deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};