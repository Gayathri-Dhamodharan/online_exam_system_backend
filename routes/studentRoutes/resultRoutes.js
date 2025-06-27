// routes/student/resultRoutes.js
const router          = require("express").Router()
const ctrl            = require("../../controllers/studentController/resultController")
const { verifyToken } = require("../../middleware/userAuthToken")

// require JWT + student role
router.use(verifyToken)
router.use((req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ error: 'Only students may access results' })
  next()
})

// fetch the detailed result for one exam
router.get('/:examId', ctrl.getResult)

module.exports = router
