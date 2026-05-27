const express = require('express');
const router = express.Router();
const bookController = require('../controller/book.controller');


// Create a new book
router.post('/books', bookController.createBook);

// Get all books
router.get('/books', bookController.getBooks);

// Get a single book by ID
router.get('/books/:id', bookController.getBookById);

// Update a book by ID
router.put('/books/:id', bookController.updateBook);

// Delete a book by ID
router.delete('/books/:id', bookController.deleteBook);

// Borrow book
router.post('/books/:id/borrow', bookController.borrowBook);

// Return book
router.post('/books/:id/return', bookController.returnBook);

module.exports = router;
//const { getBooks } = require('../controllers/bookController');
