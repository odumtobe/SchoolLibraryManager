const Book = require('../models/book.model');

exports.createBook = async (req, res) => {
    try {
        const { title, ISBN,author } = req.body;
        const book = new Book({ title, ISBN, authors: [author] });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('authors', 'name');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('authors', 'name');
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateBook = async (req, res) => {
    try {
        const { title, ISBN, authors } = req.body;
        const book = await Book.findByIdAndUpdate(req.params.id, { title, ISBN, authors }, { new: true });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.borrowBook = async (req, res) => {
    try {
        const { studentId, employeeId, issueDate, returnDate } = req.body;
        const BookId = req.params.id;


        const book = await Book.findById(BookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.status === 'unavailable') {
            return res.status(400).json({ message: "Book is currently unavailable" });
        }

        
        const Student = require('../models/student.model');
        const Librarian = require('../models/librarian.model');

        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const librarian = await Librarian.findOne({ employeeId });
        if (!librarian) {
            return res.status(404).json({
                message: "Librarian not found",
                debug: { receivedEmployeeId: employeeId, employeeIdType: typeof employeeId }
            });
        }




        book.status = 'unavailable';
        book.borrower = student._id;
        book.issuedBy = librarian._id;
        book.issueDate = issueDate ? new Date(issueDate) : Date.now();
       // book.dateReturned = returnDate ? new Date(returnDate) : null;

        await book.save();
        res.status(200).json({ message: "Book borrowed successfully", book });
    } catch (error) {
        console.error('borrowBook error:', error);
        res.status(500).json({ message: "an error occurred", error: error?.message || error });
    }
};


exports.returnBook = async (req, res) => {
    try {
        const BookId = req.params.id;
        const { studentId, employeeId } = req.body || {};

        const book = await Book.findById(BookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // If ids are provided, validate they match the currently stored borrower/issuer.
        if (studentId || employeeId) {
            const Student = require('../models/student.model');
            const Librarian = require('../models/librarian.model');

            if (studentId) {
                const student = await Student.findOne({ studentId });
                if (!student) {
                    return res.status(404).json({ message: "Student not found" });
                }
                if (!book.borrower || book.borrower.toString() !== student._id.toString()) {
                    return res.status(400).json({ message: "This book is not borrowed by the provided studentId" });
                }
            }

            if (employeeId) {
                const librarian = await Librarian.findOne({ employeeId });
                if (!librarian) {
                    return res.status(404).json({ message: "Librarian not found" });
                }
                if (!book.issuedBy || book.issuedBy.toString() !== librarian._id.toString()) {
                    return res.status(400).json({ message: "This book was not issued by the provided employeeId" });
                }
            }
        }

        book.status = 'available';
        book.borrower = studentId ? null : book.borrower; // Only clear borrower if studentId was provided and validated
        book.issuedBy = employeeId ? null : book.issuedBy; // Only clear issuer if employeeId was provided and validated
        book.dateReturned = Date.now();


        await book.save();
        res.status(200).json({ message: "Book returned successfully", book });
    } catch (error) {
        console.error('returnBook error:', error);
        res.status(500).json({ message: "an error occurred", error: error?.message || error });
    }
};



