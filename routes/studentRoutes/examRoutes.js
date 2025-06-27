// routes/student/examRoutes.js
const router          = require('express').Router()
const ctrl            = require('../../controllers/studentControllers/examController')
const { verifyToken } = require('../../middleware/userAuthToken')

// all routes require valid JWT
router.use(verifyToken)
// only students allowed
router.use((req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ error: 'Only students may access exams' })
  next()
})

// list available exams
router.get('/',              ctrl.getAvailableExams)
// get one exam’s questions/options
router.get('/:examId',       ctrl.getExamDetails)
// record a single answer
router.post('/:examId/answers',  ctrl.submitAnswer)
// finish the exam
router.post('/:examId/complete', ctrl.completeExam)

module.exports = router
