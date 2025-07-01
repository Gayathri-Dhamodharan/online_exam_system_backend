const mongoose = require("mongoose");
const Exam = require("../models/Exam");

// function sanitizeForStudent(examDoc) {
//   const obj = examDoc.toObject({ virtuals: true });
//   obj.questions = obj.questions.map((q) => {
//     const { answer, ...rest } = q;
//     return rest;
//   });
//   return obj;
// }

exports.createExam = async (req, res) => {
  try {
    let userData = req.user;

    if (userData.role !== "admin")
      return res.status(403).json({ error: "Admins only" });

    const {
      class: examClass,
      subject,
      duration,
      date, // from frontend (yyyy-mm-dd)
      time,
      selectedQuestions = [],
      isPostValidation = false,
    } = req.body;
    console.log(req.body, " req.body req.body req.body req.body");

    if (!examClass?._id || !examClass.name || !subject?._id || !subject.name) {
      return res
        .status(400)
        .json({ error: "`class` and `subject` (id+name) are required" });
    }

    const exam = new Exam({
      createdBy: { id: userData._id, role: userData.role },
      class: {
        id: examClass._id,
        name: examClass.name,
      },
      subject: {
        id: subject._id,
        name: subject.name,
      },
      selectedQuestions,
      duration: Number(duration),
      startDate: new Date(date),
      startTime: time,
      isPostValidation,
    });

    await exam.save();
    res.status(201).json({ data: exam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.getExam = async (req, res) => {
//   try {
//     const { role } = req.user;
//     const { classId, subjId } = req.params;

//     let selectField = "questionText options questionType";

//     if (role == "admin") {
//       selectField = "questionText options answer questionType";
//     }
//     const exam = await Exam.find({
//       "class.id": classId,
//       "subject.id": subjId,
//     })
//       .populate("class.id", { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
//       .populate("subject.id", "name")
//       .populate({
//         path: "selectedQuestions",
//         select: selectField,
//       });

//     if (!exam) return res.status(404).json({ error: "Exam not found" });

//     res.json(exam);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };
exports.getExam = async (req, res) => {
  try {
    const { role } = req.user;
    const { classId, subjId } = req.params;

    let selectField = "questionText options questionType";
    if (role === "admin") {
      selectField = "questionText options answer questionType";
    }

    const exam = await Exam.find({
      "class.id": classId,
      "subject.id": subjId,
    })
      .populate("subject.id", "name")
      .populate({
        path: "selectedQuestions",
        select: selectField,
      });

    if (!exam || exam.length === 0) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { role, class: userClass } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Admins only" });

    const { id } = req.params;
    const updates = req.body;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid exam ID" });

    if (
      (updates.class && (!updates.class.id || !updates.class.name)) ||
      (updates.subject && (!updates.subject.id || !updates.subject.name))
    ) {
      return res
        .status(400)
        .json({ error: "`class` and `subject` must include id+name" });
    }

    const exam = await Exam.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("class.id", "name")
      .populate("subject.id", "name")
      .populate("questions.questionId", "questionText");

    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Admins only" });

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid exam ID" });

    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json({ message: "Exam deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Admins only" });

    const { id } = req.params;
    const question = req.body;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid exam ID" });

    const exam = await Exam.findById(id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    exam.questions.push(question);
    await exam.save();
    res.json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") return res.status(403).json({ error: "Admins only" });

    const { id, questionId } = req.params;
    if (
      !mongoose.isValidObjectId(id) ||
      !mongoose.isValidObjectId(questionId)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const exam = await Exam.findById(id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const before = exam.questions.length;
    exam.questions = exam.questions.filter(
      (q) => q.questionId.toString() !== questionId
    );
    if (exam.questions.length === before) {
      return res.status(404).json({ error: "Question not in exam" });
    }

    await exam.save();
    res.json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
