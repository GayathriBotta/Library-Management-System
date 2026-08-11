const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        bookId: {
    type: String,
    default: ""
},

        title: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        isbn: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            default: ""
        },

        quantity: {
            type: Number,
            required: true,
            default: 0
        },

        available: {
            type: Number,
            default: 0
        },

        issuedTo: {
            type: String,
            default: null
        },

        issueDate: {
            type: Date,
            default: null
        },

        dueDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Book", bookSchema);