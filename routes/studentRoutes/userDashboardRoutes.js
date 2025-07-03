// routes/student/resultRoutes.js
const router          = require("express").Router()
const { verifyToken } = require("../../middleware/userAuthToken")
const userDashboard= require("../../controllers/studentController/userDashboardController")

// All routes under /api/results

router.use(verifyToken);
// GET /api/results
router.get("/user-dashboard/:id", userDashboard.getDashboardStats);

module.exports = router;
