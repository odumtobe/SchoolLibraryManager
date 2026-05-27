const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/database');

const bookRoute = require('./routes/book.route');
const librarianRoute = require('./routes/librarian.route');
const studentRoute = require('./routes/student.route');
const authorRoute = require('./routes/author.route');

const app = express();

// Middleware
app.use(express.json());

// Connect to the database (single connection)
connectDB();


// Routes
app.use('/authors', require('./routes/author.route'));
app.use('/api', bookRoute);
app.use('/api', librarianRoute);
app.use('/api', studentRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});