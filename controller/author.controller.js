const Author = require('../models/author.model');


exports.createAuthor = async (req, res) => {
    try {
        const { name, bio, dob, } = req.body;
        const newAuthor = new Author({ name, bio, dob });
        await newAuthor.save();
        res.status(201).json(newAuthor);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAuthorById = async (req, res) => {
    try {
        const authorId = req.params.id;
        const foundAuthor = await Author.findById(authorId);
        if (!foundAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json(foundAuthor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        const { name, bio, dob } = req.body;
        const updatedAuthor = await Author.findByIdAndUpdate(authorId, { name, bio, dob }, { new: true });
        if (!updatedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json(updatedAuthor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        const deletedAuthor = await Author.findByIdAndDelete(authorId);
        if (!deletedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};