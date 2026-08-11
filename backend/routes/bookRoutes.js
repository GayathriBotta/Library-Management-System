const express = require("express");
const Book = require("../models/Book");
const Issue = require("../models/Issue");

const router = express.Router();

// GET all books
router.get("/", async (req, res) => {
    try {

        const books = await Book.find().sort({ createdAt: -1 });

        // FIX: give old books their available quantity
        for (const book of books) {
            if (book.available === undefined || book.available === null) {
                book.available = book.quantity || 0;
                await book.save();
            }
        }

        // Add current fine
        const booksWithFine = await Promise.all(
            books.map(async (book) => {

                const issue = await Issue.findOne({
                    bookId: book._id,
                    status: "Issued"
                });

                let fine = 0;

                if (issue && issue.dueDate) {

                    const today = new Date();
                    const dueDate = new Date(issue.dueDate);

                    if (today > dueDate) {

                        const difference =
                            today.getTime() - dueDate.getTime();

                        const overdueDays = Math.ceil(
                            difference / (1000 * 60 * 60 * 24)
                        );

                        fine = overdueDays * 5;
                    }
                }

                return {
                    ...book.toObject(),
                    fine: fine
                };
            })
        );

        res.json(booksWithFine);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch books"
        });
    }
});


// ADD a book
router.post("/", async (req, res) => {
    try {

        const {
            title,
            author,
            category,
            isbn,
            quantity
        } = req.body;

        const existingBook = await Book.findOne({ isbn });

        if (existingBook) {
            return res.status(400).json({
                message: "A book with this ISBN already exists"
            });
        }

        const book = new Book({
            title,
            author,
            category,
            isbn,
            quantity,
            available: quantity
        });

        const savedBook = await book.save();

        res.status(201).json(savedBook);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to add book"
        });
    }
});


// DELETE a book
router.delete("/:id", async (req, res) => {
    try {

        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete book"
        });
    }
});


module.exports = router;