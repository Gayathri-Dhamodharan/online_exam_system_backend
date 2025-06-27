// controllers/studentControllers/examController.js
const ExamTemplate = require('../../models/adminModel/ExamTemplate')
const StudentExam  = require('../../models/StudentExam')

/**
 * GET /student/exams
 * → list all exams for this student’s class
 */
exports.getAvailableExams = async (req, res) => {
  try {
    const exams = await ExamTemplate.find({ class: req.user.class })
      .select('title subject startDate endDate duration')
    res.json(exams)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * GET /student/exams/:examId
 * → fetch full exam details (questions/options) for students of matching class
 */
exports.getExamDetails = async (req, res) => {
  try {
    const exam = await ExamTemplate.findById(req.params.examId)
    if (!exam) return res.status(404).json({ error: 'Exam not found' })
    if (exam.class !== req.user.class)
      return res.status(403).json({ error: 'Not allowed for your class' })

    // strip out correct answers
    const questions = exam.questions.map(q => ({
      questionId:   q._id,
      questionText: q.questionText,
      options:      q.options
    }))

    res.json({
      _id:        exam._id,
      title:      exam.title,
      subject:    exam.subject,
      startDate:  exam.startDate,
      endDate:    exam.endDate,
      duration:   exam.duration,
      questions
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * POST /student/exams/:examId/answers
 * body: { questionId, selected }
 * → record or update the student’s answer (no grading yet)
 */
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, selected } = req.body
    let attempt = await StudentExam.findOne({
      student:      req.user._id,
      examTemplate: req.params.examId
    })
    if (!attempt) {
      attempt = new StudentExam({
        student:      req.user._id,
        examTemplate: req.params.examId,
        answers:      []
      })
    }
    // upsert this question’s answer
    const idx = attempt.answers.findIndex(a =>
      a.questionId.toString() === questionId
    )
    if (idx >= 0) {
      attempt.answers[idx].selected = selected
    } else {
      attempt.answers.push({ questionId, selected })
    }
    await attempt.save()
    res.json({ message: 'Answer saved.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * POST /student/exams/:examId/complete
 * → mark attempt as completed
 */
exports.completeExam = async (req, res) => {
  try {
    const attempt = await StudentExam.findOne({
      student:      req.user._id,
      examTemplate: req.params.examId
    })
    if (!attempt) return res.status(404).json({ error: 'No in-progress attempt' })

    attempt.status  = 'completed'
    attempt.endTime = new Date()
    await attempt.save()
    res.json({ message: 'Exam completed.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
