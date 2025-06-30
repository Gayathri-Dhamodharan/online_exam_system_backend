// routes/student/resultRoutes.js
const router          = require("express").Router()
const { verifyToken } = require("../../middleware/userAuthToken")



const {
  getAllResults,
  getResultById
} = require("../../controllers/studentController/resultController");

// All routes under /api/results

router.use(verifyToken);
// GET /api/results
router.get('/', getAllResults);

// GET /api/results/:id
router.get('/:id', getResultById);

module.exports = router;
