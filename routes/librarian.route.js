const express = require('express');
const router = express.Router();
const librarianController = require('../controller/librarian.controller');


// Create a new librarian
router.post('/librarian', librarianController.createLibrarian);

// Login
router.post('/librarian/login', librarianController.loginLibrarian)

// Get all librarians
router.get('/librarian/all', librarianController.getLibrarians);


// Get a single librarian by ID
router.get('/librarian/:id', librarianController.getLibrarianById);


// Update a librarian by ID
router.put('/librarian/:id', librarianController.updateLibrarian);

// Delete a librarian by ID
router.delete('/librarian/:id', librarianController.deleteLibrarian);

module.exports = router; 

