// controllers/studentControllers/resultController.js
const Result       = require("../../models/studentModel/result")
const StudentExam  = require("../../models/studentModel/studentExam")
const ExamTemplate = require("../../models/adminModel/ExamTemplate")

/**
 * GET /student/results/:examId
 */
exports.getResult = async (req, res) => {
  try {
    const studentId = req.user._id
    const examId    = req.params.examId

    // 1) find the finished attempt
    const attempt = await StudentExam.findOne({
      student:      studentId,
      examTemplate: examId,
      status:       'completed'
    })
    if (!attempt)
      return res.status(403).json({ error: 'No completed attempt found' })

    // 2) return cached Result if exists
    let stored = await Result.findOne({ studentExam: attempt._id })
    if (stored) return res.json(stored)

    // 3) load template for correct answers & text
    const tmpl = await ExamTemplate.findById(examId)
    if (!tmpl)
      return res.status(404).json({ error: 'Exam template missing' })

    // 4) build per-question detail & aggregates
    let attended = 0, correct = 0
    const details = tmpl.questions.map(q => {
      const ans = attempt.answers.find(a =>
        a.questionId.toString() === q._id.toString()
      )
      const selected  = ans ? ans.selected : null
      const isCorrect = ans && String(selected) === String(q.answer)

      if (ans) {
        attended++
        if (isCorrect) correct++
      }

      return {
        questionId:    q._id,
        questionText:  q.questionText,
        selected,
        correctAnswer: q.answer,
        isCorrect
      }
    })

    const totalQ     = details.length
    const wrong      = attended - correct
    const notAtt     = totalQ - attended

    // 5) cache the result
    stored = await Result.create({
      studentExam:  attempt._id,
      student:      studentId,
      examTemplate: examId,
      attended,
      notAttended:  notAtt,
      correct,
      wrong,
      details
    })

    res.json(stored)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
