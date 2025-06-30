

const mongoose     = require("mongoose");
const StudentExam = require("../../models/studentModel/assignedExam");
const ExamTemplate = require("../../models/adminModel/ExamTemplate");

exports.examSummary = async (req, res) => {
  const { examId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return res.status(400).json({ error: "Invalid examId" });
  }
  try {
    const stats = await StudentExam.aggregate([
      { $match: { examTemplate: mongoose.Types.ObjectId(examId), status: "completed" } },
      { $group: {
          _id:            null,
          totalAttempts: { $sum: 1 },
          avgPercentage: { $avg: "$percentage" },
          highestScore:  { $max: "$obtainedMarks" },
          lowestScore:   { $min: "$obtainedMarks" }
      }},
      { $project: { _id: 0 } }
    ]);
    res.json(stats[0] || {
      totalAttempts: 0,
      avgPercentage: 0,
      highestScore:  0,
      lowestScore:   0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.subjectAverages = async (req, res) => {
  try {
    const data = await StudentExam.aggregate([
      { $match: { status: "completed" } },
      { $lookup: {
          from:         "examtemplates",
          localField:   "examTemplate",
          foreignField: "_id",
          as:           "template"
      }},
      { $unwind: "$template" },
      { $lookup: {
          from:         "subjects",
          localField:   "template.subject",
          foreignField: "_id",
          as:           "subject"
      }},
      { $unwind: "$subject" },
      { $group: {
          _id:            "$subject.name",
          avgPercentage: { $avg: "$percentage" },
          totalAttempts: { $sum: 1 }
      }},
      { $project: {
          _id:            0,
          subject:        "$_id",
          avgPercentage:  { $round: ["$avgPercentage", 2] },
          totalAttempts:  1
      }}
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
