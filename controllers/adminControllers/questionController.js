const Question = require("../../models/adminModel/Question");


exports.create = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can create Questions" });
    }

    const ques = await Question.create({
      ...req.body,
      createdBy: req.user._id, // ✅ always save the creator ID
    });

    res.status(201).json(ques);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const filter = {};
    // if (req.query.class)   filter.class   = req.query.class;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.type)    filter.type    = req.query.type;
    const list = await Question.find(filter)
      // .populate("class")
      .populate("subject");
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const ques = await Question.findById(req.params.id)
      // .populate("class")
      .populate("subject");
    if (!ques) return res.status(404).json({ error: "Not found" });
    res.json(ques);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const ques = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ques) return res.status(404).json({ error: "Not found" });
    res.json(ques);
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
