
const router = require("express").Router();
const questionCtrl = require('../../controllers/adminControllers/questionController');
const { verifyToken } = require("../../middleware/userAuthToken")

// POST   /questions          → createQuestion
// GET    /questions/:id      → getQuestionById
// DELETE /questions/:id      → deleteQuestionById
// PATCH  /questions/:id/answer → updateAnswerById

router.use(verifyToken);
router.post('/', questionCtrl.createQuestion);
router.get('/:id', questionCtrl.getQuestion);
router.delete('/:id', questionCtrl.deleteQuestion);
router.put('/:id', questionCtrl.updateQuestion);

module.exports = router;
