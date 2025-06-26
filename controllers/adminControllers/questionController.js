const Question = require("../models/Question");

exports.create = async (req, res) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.class)   filter.class   = req.query.class;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.type)    filter.type    = req.query.type;
    const list = await Question.find(filter)
      .populate("class")
      .populate("subject");
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id)
      .populate("class")
      .populate("subject");
    if (!q) return res.status(404).json({ error: "Not found" });
    res.json(q);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ error: "Not found" });
    res.json(q);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
