const Subject = require("../models/Subject");

exports.create = async (req, res) => {
  try {
    const subj = await Subject.create(req.body);
    res.status(201).json(subj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const list = await Subject.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const subj = await Subject.findById(req.params.id);
    if (!subj) return res.status(404).json({ error: "Not found" });
    res.json(subj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const subj = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subj) return res.status(404).json({ error: "Not found" });
    res.json(subj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
