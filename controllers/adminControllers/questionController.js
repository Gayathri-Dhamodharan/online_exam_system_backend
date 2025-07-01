// controllers/questionController.js

const Question = require("../../models/adminModel/Question");
const mongoose = require("mongoose");
exports.createQuestion = async (req, res) => {
  try {
    const {
      userId,
      class: cls,
      subject,
      questionType,
      questionText,
      questionOptions,
      answer,
      marks,
    } = req.body;

    if (!userId || !userId.id || !userId.role) {
      return res
        .status(400)
        .json({ error: "userId.id and userId.role are required." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId.id) ||
      !mongoose.Types.ObjectId.isValid(cls.id) ||
      !mongoose.Types.ObjectId.isValid(subject.id)
    ) {
      return res.status(400).json({
        error: "Invalid ObjectId in userName, className, or subjectName.",
      });
    }

    const exists = await Question.findOne({
      questionText: questionText.trim(),
    });
    if (exists) {
      return res
        .status(409)
        .json({ error: "A question with that text already exists." });
    }

    const q = new Question({
      userId,
      class: cls,
      subject,
      questionType,
      questionText: questionText.trim(),
      questionOptions,
      answer,
      marks,
    });

    await q.save();
    return res.status(201).json({ data: q });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const list = await Question.find()
      .populate("userId.id", "name role")
      .populate("class.id", "name")
      .populate("subject.id", "name")
      .sort({ createdAt: -1 });

    return res.json(list);
  } catch (err) {
    console.error("Error fetching questions:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid question ID." });
    }

    const q = await Question.findById(id)
      .populate("userId.id", "name role")
      .populate("class.id", "name")
      .populate("subject.id", "name");

    if (!q) {
      return res.status(404).json({ error: "Question not found." });
    }

    return res.json(q);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid question ID." });
    }

    const q = await Question.findByIdAndDelete(id);
    if (!q) {
      return res.status(404).json({ error: "Question not found." });
    }

    return res.json({ message: "Question deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid question ID." });
    }

    const maybeValidateId = (path) => {
      const val = path.split(".").reduce((o, k) => o && o[k], updates);
      if (val && !mongoose.Types.ObjectId.isValid(val)) {
        throw new Error(`Invalid ObjectId for ${path}`);
      }
    };
    try {
      maybeValidateId("userId.id");
      maybeValidateId("class.id");
      maybeValidateId("subject.id");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (updates.questionText) {
      const text = updates.questionText.trim();
      const exists = await Question.findOne({
        questionText: text,
        _id: { $ne: id },
      });
      if (exists) {
        return res
          .status(409)
          .json({ error: "Another question with that text already exists." });
      }
      updates.questionText = text;
    }

    if (typeof updates.answer === "string")
      updates.answer = updates.answer.trim();
    if (typeof updates.class?.name === "string")
      updates.class.name = updates.class.name.trim();
    if (typeof updates.subject?.name === "string")
      updates.subject.name = updates.subject.name.trim();

    const q = await Question.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("userId.id", "name role")
      .populate("class.id", "name")
      .populate("subject.id", "name");

    if (!q) {
      return res.status(404).json({ error: "Question not found." });
    }

    return res.json({data:q});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
};
