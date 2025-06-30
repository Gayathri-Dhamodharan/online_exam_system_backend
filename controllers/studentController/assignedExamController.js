
const AssignedExam = require("../../models/studentModel/studentExam");
const ExamTemplate = require("../../models/adminModel/ExamTemplate");

exports.list = async (req, res, next) => {
  const list = await AssignedExam
    .find({ student: req.user._id })
    .populate('examTemplate');
  res.json(list);
};

exports.start = async (req, res, next) => {
  const ae = await AssignedExam.findOneAndUpdate(
    { _id: req.params.id, student: req.user._id },
    { startedAt: Date.now(), status: 'started' },
    { new: true }
  );
  res.json(ae);
};

exports.getExam = async (req, res, next) => {
  const ae = await AssignedExam
    .findOne({ _id: req.params.id, student: req.user._id, status: 'started' })
    .populate({
      path: 'examTemplate',
      select: 'title duration questions startDate endDate',
    });
  if (!ae) return res.status(404).json({ message: 'Exam not available' });

  const { questions, ...meta } = ae.examTemplate.toObject();
  const noAnsQs = questions.map(q => {
    const { answer, ...rest } = q;
    return rest;
  });

  res.json({ ...meta, questions: noAnsQs, assignedId: ae._id });
};
