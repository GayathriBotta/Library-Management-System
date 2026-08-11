const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const Student = require("../models/Student");
const Book = require("../models/Book");

// Issue a book
router.post("/", async (req, res) => {
    try {
        const { studentId, bookId } = req.body;

        if (!studentId || !bookId) {
            return res.status(400).json({
                message: "Student and Book are required"
            });
        }

        const student = await Student.findById(studentId);
        const book = await Book.findById(bookId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Check available quantity
        if (book.available <= 0) {
            return res.status(400).json({
                message: "Book is not available"
            });
        }

        // Create issue record
       // Create issue record
const issueDate = new Date();

const dueDate = new Date(issueDate);
dueDate.setDate(dueDate.getDate() + 14);

const issue = new Issue({
    studentId: student._id,
    bookId: book._id,
    issueDate: issueDate,
    dueDate: dueDate,
    fine: 0,
    status: "Issued"
});

await issue.save();
// Decrease available books
book.available = book.available - 1;

await Book.findByIdAndUpdate(
    book._id,
    {
        available: book.available
    },
    {
        new: true
    }
);
        res.status(201).json({
            message: "Book issued successfully",
            issue
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to issue book",
            error: error.message
        });
    }
});


// Get all issued books
router.get("/", async (req, res) => {
    try {
        const issues = await Issue.find()
            .populate("studentId")
            .populate("bookId");

        res.json(issues);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch issued books",
            error: error.message
        });
    }
});


// Return a book
router.put("/:id/return", async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue record not found"
            });
        }

        if (issue.status === "Returned") {
            return res.status(400).json({
                message: "Book has already been returned"
            });
        }

        const book = await Book.findById(issue.bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Increase available quantity, but never above total quantity
book.available = Math.min(book.available + 1, book.quantity);
await book.save();
        // Calculate fine
const returnDate = new Date();

let fine = 0;

if (issue.dueDate && returnDate > issue.dueDate) {

    const overdueTime =
        returnDate.getTime() - issue.dueDate.getTime();

    const overdueDays = Math.ceil(
        overdueTime / (1000 * 60 * 60 * 24)
    );

    const finePerDay = 5;

    fine = overdueDays * finePerDay;
}

// Update issue record
issue.status = "Returned";
issue.returnDate = returnDate;
issue.fine = fine;

await issue.save();
        res.json({
            message: "Book returned successfully",
            issue
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to return book",
            error: error.message
        });
    }
});


module.exports = router;