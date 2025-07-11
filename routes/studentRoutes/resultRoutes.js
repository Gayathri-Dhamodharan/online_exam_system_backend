// routes/student/resultRoutes.js
const router          = require("express").Router()
const { verifyToken } = require("../../middleware/userAuthToken")
const result= require("../../controllers/examController")

// All routes under /api/results

router.use(verifyToken);
// GET /api/results
router.get("/result", result.getAttendedExams);

module.exports = router;
