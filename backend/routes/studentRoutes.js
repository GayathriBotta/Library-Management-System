const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch students"
        });
    }
});

// ADD student
router.post("/", async (req, res) => {
    try {
        const {
            studentId,
            name,
            email,
            phone,
            department,
            year
        } = req.body;

        const existingStudent = await Student.findOne({ studentId });

        if (existingStudent) {
            return res.status(400).json({
                message: "Student ID already exists"
            });
        }

        const student = new Student({
            studentId,
            name,
            email,
            phone,
            department,
            year
        });

        const savedStudent = await student.save();

        res.status(201).json(savedStudent);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add student"
        });
    }
});

// DELETE student
router.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete student"
        });
    }
});

module.exports = router;