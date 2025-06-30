// routes/examRoutes.js
const  router   = require('express').Router();
const examCtrl     = require('../controllers/examController');
const { verifyToken } = require("../middleware/userAuthToken")

// All exam routes require the user to be authenticated
router.use(verifyToken);

/**
 * Admin only:
 *   - Create a new exam
 *   - Update an existing exam
 *   - Delete an exam
 *   - Add a question to an exam
 *   - Remove a question from an exam
 */
router
  .route('/')
  .post(examCtrl.createExam);

router
  .route('/:id')
  .get(examCtrl.getExam)        // Admin sees full exam; student sees it (sans answers) only if class matches
  .put(examCtrl.updateExam)     // Admin only
  .delete(examCtrl.deleteExam); // Admin only

/**
 * Question management (admin only)
 */
router
  .route('/:id/questions')
  .post(examCtrl.addQuestion);

router
  .route('/:id/questions/:questionId')
  .delete(examCtrl.deleteQuestion);

module.exports = router;
