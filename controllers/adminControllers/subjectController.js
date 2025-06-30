const Subject = require("../../models/adminModel/Subject");
const mongoose = require('mongoose');

exports.getAllSubjects = async (req, res) => {
  try {
    const list = await Subject.find()
      .populate('createdBy','name email')
      .populate('class','name section')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};


exports.getSubjectById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid subject ID.' });
  }
  try {
    const subj = await Subject.findById(id)
      .populate('createdBy','name email')
      .populate('class','name section');
    if (!subj) return res.status(404).json({ error: 'Subject not found.' });
    res.json(subj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};


exports.createSubject = async (req, res) => {
  const { name, class: classId } = req.body;

  
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "'name' is required and must be a non-empty string." });
  }
  if (!mongoose.isValidObjectId(classId)) {
    return res.status(400).json({ error: "'class' must be a valid Class ID." });
  }


  const createdBy = req.user?.id;
  if (!createdBy || !mongoose.isValidObjectId(createdBy)) {
    return res.status(401).json({ error: "Unauthorized: missing or invalid user." });
  }

  try {
    const newSubject = await Subject.create({
      name: name.trim(),
      class: classId,
      createdBy,
    });

    const populated = await Subject.findById(newSubject._id)
      .populate("createdBy", "name email")
      .populate("class", "name section");

    res.status(201).json(populated);

  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ error: "Server error while creating subject." });
  }
};
