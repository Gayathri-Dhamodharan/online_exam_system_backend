const ExamTemplate = require("../models/ExamTemplate");
const Question     = require("../models/Question");

exports.createTemplate = async (req, res) => {
  try {
    const { title, class: cls, subject, examDate, duration } = req.body;
    const tpl = await ExamTemplate.create({
      title, class: cls, subject, examDate, duration, questions: []
    });
    res.status(201).json(tpl);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const filter = {};
    if (req.query.class)   filter.class   = req.query.class;
    if (req.query.subject) filter.subject = req.query.subject;
    const list = await ExamTemplate.find(filter)
      .populate("class","name")
      .populate("subject","name");
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const tpl = await ExamTemplate.findById(req.params.id)
      .populate("class","name")
      .populate("subject","name");
    if (!tpl) return res.status(404).json({ error: "Not found" });
    res.json(tpl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { title, class: cls, subject, examDate, duration } = req.body;
    const update = { title, class: cls, subject, examDate, duration };
    const tpl = await ExamTemplate.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!tpl) return res.status(404).json({ error: "Not found" });
    res.json(tpl);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    await ExamTemplate.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const tpl = await ExamTemplate.findById(req.params.id);
    if (!tpl) return res.status(404).json({ error: "Template not found" });

    const q = await Question.findById(req.body.questionId);
    if (!q) return res.status(404).json({ error: "Question not found" });

    tpl.questions.push({
      originalQuestion: q._id,
      questionText:     q.questionText,
      type:             q.type,
      options:          q.options,
      answer:           q.answer
    });

    await tpl.save();
    res.json(tpl);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeQuestion = async (req, res) => {
  try {
    const tpl = await ExamTemplate.findById(req.params.id);
    if (!tpl) return res.status(404).json({ error: "Template not found" });

    tpl.questions.id(req.params.qId)?.remove();
    await tpl.save();
    res.json(tpl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
