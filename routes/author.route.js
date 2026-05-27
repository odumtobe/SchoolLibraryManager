const express = require('express');
const router = express.Router();
const authorController = require('../controller/author.controller');


// Create a new author
router.post('/author', authorController.createAuthor);

// Get all authors
router.get('/author/all', authorController.getAuthors);

// Get a single author by ID
router.get('/author/:id', authorController.getAuthorById);

// Update an author by ID
router.put('/author/:id', authorController.updateAuthor);

// Delete an author by ID
router.delete('/author/:id', authorController.deleteAuthor);

module.exports = router;