const Subject = require("../../models/adminModel/Subject");


exports.create = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can create subjects" });
    }

    // Add admin ID to the subject
    const subj = await Subject.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(subj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "admin") {
      filter = { createdBy: req.user._id };
    }

    const list = await Subject.find(filter);
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
