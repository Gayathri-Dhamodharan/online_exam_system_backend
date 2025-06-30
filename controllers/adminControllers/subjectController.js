const Subject = require("../../models/adminModel/Subject");
const mongoose = require("mongoose");

// ✅ GET all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const list = await Subject.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// ✅ GET subject by ID
exports.getSubjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid subject ID." });
  }

  try {
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }
    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// ✅ CREATE subject
exports.createSubject = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res
      .status(400)
      .json({ error: "'name' is required and must be a non-empty string." });
  }

  try {
    const newSubject = await Subject.create({
      name: name.trim(),
    });

    res.status(201).json(newSubject);
  } catch (err) {
    console.error("Error creating subject:", err);

    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "Subject with this name already exists." });
    }

    res.status(500).json({ error: "Server error while creating subject." });
  }
};
