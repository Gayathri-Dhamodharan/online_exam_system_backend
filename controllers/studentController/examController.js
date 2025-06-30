// // controllers/studentControllers/examController.js
// const ExamTemplate = require("../../models/adminModel/ExamTemplate")
// const StudentExam  = require("../../models/studentModel/studentExam")

// /**
//  * GET /student/exams
//  * → list all exams for this student’s class
//  */
// exports.getAvailableExams = async (req, res) => {
//   try {
//     const exams = await ExamTemplate.find({ class: req.user.class })
//       .select('title subject startDate endDate duration')
//     res.json(exams)
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }

// exports.getExamDetails = async (req, res) => {
//   try {
//     const exam = await ExamTemplate.findById(req.params.examId)
//     if (!exam) return res.status(404).json({ error: 'Exam not found' })
//     if (exam.class !== req.user.class)
//       return res.status(403).json({ error: 'Not allowed for your class' })

//     // strip out correct answers
//     const questions = exam.questions.map(q => ({
//       questionId:   q._id,
//       questionText: q.questionText,
//       options:      q.options
//     }))

//     res.json({
//       _id:        exam._id,
//       title:      exam.title,
//       subject:    exam.subject,
//       startDate:  exam.startDate,
//       endDate:    exam.endDate,
//       duration:   exam.duration,
//       questions
//     })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }

// exports.submitAnswer = async (req, res) => {
//   try {
//     const {
//       student,
//       examTemplate,
//       answers,
//       status = "in_progress",
//       startTime,
//       endTime,
//     } = req.body;

//     if (!student || !examTemplate || !Array.isArray(answers)) {
//       return res
//         .status(400)
//         .json({ error: "Missing required fields or answers array." });
//     }

//     // Upsert exam attempt
//     let attempt = await StudentExam.findOne({ student, examTemplate });

//     if (attempt) {
//       attempt.answers = answers;
//       attempt.status = status;
//       if (startTime) attempt.startTime = startTime;
//       if (endTime) attempt.endTime = endTime;
//     } else {
//       attempt = new StudentExam({
//         student,
//         examTemplate,
//         answers,
//         status,
//         startTime,
//         endTime,
//       });
//     }

//     await attempt.save();
//     return res.json({ message: "Exam answers submitted successfully." });
//   } catch (err) {
//     console.error("Error submitting exam answers:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.completeExam = async (req, res) => {
//   try {
//     const attempt = await StudentExam.findOne({
//       student:      req.user._id,
//       examTemplate: req.params.examId
//     })
//     if (!attempt) return res.status(404).json({ error: 'No in-progress attempt' })

//     attempt.status  = 'completed'
//     attempt.endTime = new Date()
//     await attempt.save()
//     res.json({ message: 'Exam completed.' })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }
